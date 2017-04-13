/* flow */
import Transformation from '../immutables/Transformation';
import { EditorState, Modifier, SelectionState, ContentState , BlockMapBuilder} from 'draft-js';
const getSelectionStateForOffset = (
  contentState: ContentState,
  offset: number
) => {
  let blockOffset = 0;
  let selectionState;
  contentState.getBlockMap().forEach((contentBlock) => {
    const blockLength = contentBlock.getText().length + 1;
    if (blockOffset <= offset && offset < blockLength) {
      selectionState = SelectionState
        .createEmpty(contentBlock.getKey())
        .set('anchorOffset', offset - blockOffset)
        .set('focusOffset', offset - blockOffset);
    }
    blockOffset += blockLength;
  });
  return selectionState;
};

const applyTextTransformationToEditorState = (
  transformation: Transformation,
  editorState: EditorState
) : EditorState => {
  const contentState = editorState.getCurrentContent();
  let offset = 0;
  const operations = transformation.get('operations');
  const newContentState = operations.reduce((memoContentState, operation) => {
    const selectionState = getSelectionStateForOffset(memoContentState, offset);
    const focusOffsetRemoval = selectionState.getFocusOffset() + operation.numOfValues;
    switch (operation.type) {
      case 'insert':
        offset += operation.numOfValues;
        return Modifier.insertText(
          memoContentState,
          selectionState,
          operation.values
        );
      case 'retain':
        offset += operation.numOfValues;
        break;
      case 'delete':
        offset -= operation.numOfValues;
        return Modifier.removeRange(
          memoContentState,
          selectionState.set('focusOffset', focusOffsetRemoval),
          'backward'
        );
      default:
        return memoContentState;
    }
    return memoContentState;
  }, contentState);

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'apply-transformation'
  );

  return newEditorState;
};
const applyBlockMapTransformation = (transformation,editorState)=>{
  const currentContent = editorState.getCurrentContent()
  const contentBlocks =currentContent.getBlocksAsArray();
  let offset = 0;
  const operations = transformation.get('operations');
  const newContentBlocks = operations.reduce((memoContentBlocks, operation) => {
    console.log('blocks:',memoContentBlocks)
    switch (operation.type) {
      case 'merge':
        console.log("merge", operation)
        break;
      case 'insert':
        console.log('insert',operation.values, offset)
        memoContentBlocks.splice(offset,0, operation.value)
        offset += operation.numOfValues;
        break;
      case 'retain':
        offset += operation.numOfValues;
        break;
      case 'delete':
        memoContentBlocks.splice(offset,operation.numOfValues )
        offset -= operation.numOfValues;
    }
    console.log("memo",memoContentBlocks)
    return memoContentBlocks;
  }, contentBlocks);

  const newContent = currentContent.merge({
    blockMap: BlockMapBuilder.createFromArray(newContentBlocks),
  })
  const newEditorState = EditorState.push(
    editorState,
    newContent,
    'apply-transformation'
  );

  return newEditorState;

}
const applyTransformationToEditorState = (transformations, editorState) => {
  console.log(transformations)
  if(transformations.blocks && transformations.blocks.operations.length){
    return applyBlockMapTransformation(transformations.blocks, editorState)
  }
  if(transformations.text && transformations.text.operations.length){
    return applyTextTransformationToEditorState(transformations.text, editorState)

  }
}
export default applyTransformationToEditorState;
