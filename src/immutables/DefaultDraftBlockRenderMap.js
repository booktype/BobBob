
import {Map} from 'immutable';

`
  parents: [element] // Create Parents if they don't exist

  type: text | block // text.children = [block, structure]
                     // text.parents = [structure, none]
                     // none.children = [none, text]
                     // none.parents = [none, structure]
                     // block.children = []
                     // block.parents = [text]
                     // structure.children = [none, text, structure]
                     // structure.parents = [text]
                     // if text then cut text, insert block, paste text
                     // if block:
                     //   if collapsed:
                     //     if in text:
                     //       then cut text, insert block, paste text
                     //     else if block:
                     //       then toggle from one type to the other
                     //   else:
                     //     if in text:
                     //       then split toggle selectedBefore: p, selected: type, selectedAfter: p
                     //       then append
                     //     elseif block:
                     //       then split toggle selectedBefore: currentType, selected: type, selectedAfter: currentType
                     //       then replace
`
const DefaultDraftBlockRenderMap = Map({
  'firstblock':{
    element: 'div',
    void: true
  },
  'table':{
    element: 'table',
    type: "structure",
    toggle: (controller)=>{
      return controller.insertElementAfter("table")
      .appendChild("tbody").appendChild("tr").appendChild("td")
      .insertElementAfter("td").getCurrentContent()
    }
  },
  'caption': {
    element: 'caption',
    parents: ['table']
  },
  colgroup: {
    element: 'colgroup',
    parents: ['table']
  },
  col: {
    element: 'col',
    parents: ['colgroup']
  },
  'tbody':{
    element: 'tbody',
    parents: ['table']
  },
  'thead':{
    element: 'thead',
    parents: ['table']
  },
  'tfoot':{
    element: 'tfoot',
    parents: ['table']
  },
  'tr':{
    element: 'tr',
    parents: ['tbody', 'thead', 'tfoot'],
    toggle: (controller)=>{
      const columns = controller.queryParent("tr")
                                     .countChildren()
      return controller.insertElementBefore("tr")
                            .appendChildren("td", columns)
                            .getCurrentContent()
    }
  },
  'th':{
    element: 'th',
    parents: ['tr'],
    type: "text"
  },
  'td':{
    element: 'td',
    parents: ['tr'],
    type: "text",
    toggle: (controller)=>{
      const at_index = controller.getChildIndex()
      return controller.queryParent("tbody")
        .queryAndAppend("tr","td", at_index).getCurrentContent()
    }
  },
  'ul':{
    element: 'ul',
    type: 'structure',
    toggle: (controller)=>{
      return controller.insertElementAfter("ul")
      .appendChild("li").getCurrentContent()
    }
  },
  'ol':{
    element: 'ol',
    type: 'structure',
    toggle: (controller)=>{
      console.log("ol")
      return controller.insertElementAfter("ol")
      .appendChild("li").getCurrentContent()
    }
  },
  'li':{
    element: 'li',
    parents: ['ul', 'ol'],
    type: "text"
  },
  h1: {
    element: 'h1',
    type: "block"
  },
  h2: {
    element: 'h2',
    type: "block"
  },
  h3: {
    element: 'h3',
    type: "block"
  },
  h4: {
    element: 'h4',
    type: "block"
  },
  h5: {
    element: 'h5',
    type: "block"
  },
  h6: {
    element: 'h6',
    type: "block"
  },
  'blockquote': {
    element: 'blockquote',
    type: 'block'
  },
  'p':{
    element: 'p',
    type: 'block'
  },
  hr:{
    element: 'hr',
    void: true
  },
  pre: {
    element: 'pre'
  },
  figure: {
    element: 'figure',
    type: 'structure'
  },
  figcaption: {
    element: 'figcaption',
    parents: ['figure'],
    type: 'text'
  },
  'div': {
    element: 'div',
    type: 'text'
  },

  // 'atomic': {
  //   element: 'figure',
  // },
  // 'code-block': {
  //   element: 'pre',
  //   wrapper: PRE_WRAP,
  // },
  'unstyled': {
    element: 'div',
  },
});

export default DefaultDraftBlockRenderMap;
