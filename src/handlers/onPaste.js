import {BlockMapBuilder} from 'draft-js';
import Immutable from 'immutable';
import insertFragment from '../transactions/insertFragment';
import {parse} from '../encoding/html';


export default function onPaste(editorState, html) {
  if (html) {
    let translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    let translate = {
      "nbsp": " ",
      "amp": "&",
      "quot": "\"",
      "lt": "<",
      "gt": ">"
    };
    console.log(html)
    html = html.replace(translate_re, function (match, entity) {
      return translate[entity];
    })
    let htmlFragment = parse(html)
    if (htmlFragment) {
      const {blocks, metaMap} = htmlFragment;
      if (blocks) {
        let htmlMap = BlockMapBuilder.createFromArray(blocks,);
        return insertFragment(editorState, htmlMap, Immutable.OrderedMap(), metaMap)
      }
    }
  }

}
