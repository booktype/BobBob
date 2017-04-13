import convertFromHTMLtoContentBlocks from '../encoding/convertFromHTMLtoContentBlocks';
import {BlockMapBuilder} from 'draft-js';
import insertFragment from '../transactions/insertFragment';
import getSafeBodyFromHTML from 'draft-js/lib/getSafeBodyFromHTML'
import editOnPaste from 'draft-js/lib/editOnPaste';
import DataTransfer from 'fbjs/lib/DataTransfer';
export default function onPaste ( editorState, html){
  if (html) {
    var htmlFragment = convertFromHTMLtoContentBlocks(
      html,
      getSafeBodyFromHTML,
    );
    if (htmlFragment) {
      const { contentBlocks, entityMap } = htmlFragment;
      if (contentBlocks) {
        var htmlMap = BlockMapBuilder.createFromArray(contentBlocks);
        return insertFragment(editorState, htmlMap, entityMap)
      }
    }
  }

}
