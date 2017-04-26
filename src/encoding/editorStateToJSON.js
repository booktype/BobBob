
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  getVisibleSelectionRect} from "draft-js";


export default function editorStateToJSON(editorState) {
  if (editorState) {
    const content = editorState.getCurrentContent();
    return JSON.stringify(convertToRaw(content), null, 2);
  }
}
