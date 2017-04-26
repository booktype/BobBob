
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  getVisibleSelectionRect} from "draft-js";


export default function editorStateFromRaw(rawContent) {
  if (rawContent) {
    const content = convertFromRaw(rawContent);
    return EditorState.createWithContent(content);
  } else {
    return EditorState.createEmpty();
  }
}
