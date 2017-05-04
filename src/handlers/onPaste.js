import convertFromHTMLtoContentBlocks from '../encoding/convertFromHTMLtoContentBlocks';
import {BlockMapBuilder} from 'draft-js';
import insertFragment from '../transactions/insertFragment';
import getSafeBodyFromHTML from 'draft-js/lib/getSafeBodyFromHTML'
import editOnPaste from 'draft-js/lib/editOnPaste';
import DataTransfer from 'fbjs/lib/DataTransfer';
import {parse} from '../encoding/html';
import Immutable from 'immutable';
export default function onPaste ( editorState, html){
  if (html) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
      "nbsp": " ",
      "amp" : "&",
      "quot": "\"",
      "lt"  : "<",
      "gt"  : ">"
    };
    console.log(html)
    html = html.replace(translate_re, function(match, entity) {
      return translate[entity];
    })
    var htmlFragment = parse(html)
    if (htmlFragment) {
      const { blocks, metaMap } = htmlFragment;
      if (blocks) {
        var htmlMap = BlockMapBuilder.createFromArray(blocks, );
        return insertFragment(editorState, htmlMap, Immutable.OrderedMap(), metaMap )
      }
    }
  }

}
