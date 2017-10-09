import {EditorState, Modifier} from 'draft-js';


export default function insertFragment(editorState: EditorState,
                                       fragment: BlockMap,
                                       entityMap: ?EntityMap,): EditorState {
  let newContent = Modifier.replaceWithFragment(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    fragment,
  );
  // TODO: merge the entity map once we stop using DraftEntity
  // like this:
  // const mergedEntityMap = newContent.getEntityMap().merge(entityMap);

  return EditorState.push(
    editorState,
    newContent.set('entityMap', entityMap),
    'insert-fragment',
  );
}
