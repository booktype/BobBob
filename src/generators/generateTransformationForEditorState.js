import type { EditorState } from 'draft-js';
import * as jsDiff from 'diff';
import Transformation from '../immutables/Transformation';

const generateTextTransformationForEditorState = (
  previousEditorState: EditorState,
  editorState: EditorState
) => {
  const previousText = previousEditorState.getCurrentContent().getPlainText();
  const currentText = editorState.getCurrentContent().getPlainText();
  if (previousText === currentText){
    return null
  }
  const differences = jsDiff.diffChars(previousText, currentText);
  console.log(differences)
  return differences.reduce((transformation, diff) => {
    if (diff.added) {
      return transformation.insert(diff.value);
    }
    if (diff.removed) {
      return transformation.delete(diff.count);
    }
    return transformation.retain(diff.count);
    return transformation
  }, new Transformation());
};
const generateBlockMapTransformation = (
  previousEditorState,
  editorState
) => {
  console.log("genmap")
  const currentContent = editorState.getCurrentContent()
  const previousContent = previousEditorState.getCurrentContent()
  const currentBlocks = currentContent.getBlocksAsArray().map(
    (block, idx)=>{
      const previousBlock = previousContent.getBlockForKey(block.getKey())
      if(previousBlock){
        const data = block.getData()
        block =  block.toJSON()
        let i=0
        if(previousBlock.getDepth()===block.depth){
          i++
          delete block.depth
        }
        if(previousBlock.getType()===block.type){
          i++
          delete block.type
        }
        if(previousBlock.getData()===data){
          i++
          delete block.data
        }
        delete block.text
        delete block.characterList
        if(i===3){
          return block.key
        }

        console.log("blocksss", block)
        return block
      }
  })

  const previousBlocks = previousContent.getBlocksAsArray().map((block, idx)=>{
      return block.getKey()
  })
  console.log(previousBlocks, currentBlocks)
  const differences = jsDiff.diffArrays(
    previousBlocks,currentBlocks
  )

  return differences.reduce((transformation, diff) => {
    // console.log(diff.value[0].toJSON())
    // console.log(jsDiff.diffJson(diff.value[0]))
    if (diff.added) {
      console.log("prev",previousBlocks)
      console.log(diff.value)
      for (let i in diff.value){
        if(typeof diff.value[i]=== "string" && previousBlocks.includes(diff.value[i])){
          transformation.retain(diff.count)
        }else if(previousBlocks.includes(diff.value[i].key)){
          transformation.merge(diff.value)
        }else{
          transformation.insert(diff.value);

        }
      }
      return transformation
    }
    if (diff.removed) {
      console.log(diff)
      if(previousBlocks.indexOf(diff.value[0])!==-1){
        return transformation
      }
      return transformation.delete(diff.count);
    }
    return transformation.retain(diff.count);
  }, new Transformation()).toJSON();
}
export default (previousEditorState, editorState)=>{
  if(previousEditorState.getCurrentContent() === editorState.getCurrentContent()){
      return null
  }
  let blockTransform = generateBlockMapTransformation(previousEditorState,editorState)
  if(blockTransform.operations.size == 1 && blockTransform.operations.get(0).get('type') === "retain"){
    blockTransform = null
  }
  return {
    text: generateTextTransformationForEditorState(previousEditorState, editorState),
    blocks: blockTransform
  }
};
