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
  "figure": {
    "name": "Figure",
    "children": [
      "flow", "figcaption"
    ],
    "element": "figure"
  },
  'unstyled': {
    element: 'div',
  },
  "figcaption": {
    "name": "Figure caption",
    "parents": ["figure"],
    "children": ["flow"],
    "element": "figcaption"
  },
  "dl": {
    "name": "Description list",
    "children": [
      "dt", "dd"
    ],
    "attributes": ["compact"],
    "element": "dl"
  },
  "blockquote": {
    "name": "Quote",
    "children": ["flow"],
    "attributes": ["cite"],
    "element": "blockquote"
  },
  "th": {
    "name": "Header Cell",
    "parents": ["tr"],
    "children": ["flow"],
    "attributes": [
      "abbr",
      "align",
      "axis",
      "bgcolor",
      "char",
      "charoff",
      "colspan",
      "headers",
      "height",
      "nowrap",
      "rowspan",
      "scope",
      "valign",
      "width"
    ],
    "element": "th"
  },
  "hr": {
    "name": "Separator",
    "attributes": [
      "align", "noshade", "size", "width"
    ],
    "element": "hr",
    "void": true
  },
  "h6": {
    "name": "Heading 6",
    "children": ["inline"],
    "attributes": ["align"],
    "element": "h6"
  },
  "dd": {
    "name": "Term description",
    "parents": ["dl"],
    "children": ["flow"],
    "element": "dd"
  },
  "tbody": {
    "name": "Table body",
    "parents": ["table"],
    "children": ["tr"],
    "attributes": [
      "align", "char", "charoff", "valign"
    ],
    "element": "tbody"
  },
  "p": {
    "name": "Paragraph",
    "children": ["inline"],
    "attributes": ["align"],
    "element": "p"
  },
  "caption": {
    "name": "Table caption",
    "parents": ["table"],
    "children": ["inline"],
    "attributes": ["align"],
    "element": "caption"
  },
  "col": {
    "parents": [
      "colgroup", "table"
    ],
    "attributes": [
      "align",
      "char",
      "charoff",
      "span",
      "valign",
      "width"
    ],
    "element": "col",
    "void": true
  },
  "tfoot": {
    "name": "Table footer",
    "parents": ["table"],
    "children": ["tr"],
    "attributes": [
      "align", "char", "charoff", "valign"
    ],
    "element": "tfoot"
  },
  "dt": {
    "name": "Term",
    "parents": ["dl"],
    "children": ["inline"],
    "element": "dt"
  },
  "h5": {
    "name": "Heading 5",
    "children": ["inline"],
    "attributes": ["align"],
    "element": "h5"
  },
  "div": {
    "name": "Division",
    "children": ["flow"],
    "attributes": ["align"],
    "element": "div"
  },
  "thead": {
    "name": "Table head",
    "parents": ["table"],
    "children": ["tr"],
    "attributes": [
      "align", "char", "charoff", "valign"
    ],
    "element": "thead"
  },
  "pre": {
    "name": "Preformatted text",
    "excludeChildren": [
      "img",
      "big",
      "small",
      "sub",
      "sup",
      "font"
    ],
    "children": ["inline"],
    "attributes": ["width"],
    "element": "pre"
  },
  "ol": {
    "name": "Ordered List",
    toggle: (controller)=>{
      return controller.insertElementAfter("ol")
      .appendChild("li").getCurrentContent()
    },
    "children": ["li"],
    "attributes": [
      "compact", "reversed", "start", "type"
    ],
    "element": "ol"
  },
  "center": {
    "children": ["flow"],
    "element": "center"
  },
  "colgroup": {
    "parents": ["table"],
    "children": ["col"],
    "attributes": [
      "align",
      "char",
      "charoff",
      "span",
      "valign",
      "width"
    ],
    "element": "colgroup"
  },
  "h2": {
    "name": "Heading 2",
    "children": ["inline"],
    "attributes": ["align"],
    "element": "h2"
  },
  "h3": {
    "name": "Heading 3",
    "children": ["inline"],
    "attributes": ["align"],
    "element": "h3"
  },
  "h1": {
    "name": "Heading 1",
    "children": ["inline"],
    "attributes": ["align"],
    "element": "h1"
  },
  "tr": {
    "name": "Row",
    toggle: (controller)=>{
      const columns = controller.queryParent("tr")
                                     .countChildren()
      return controller.insertElementBefore("tr")
                            .appendChildren("td", columns)
                            .getCurrentContent()
    },
    "parents": [
      "tbody", "thead", "tfoot"
    ],
    "children": [
      "td", "th"
    ],
    "attributes": [
      "align", "bgcolor", "char", "charoff", "valign"
    ],
    "element": "tr"
  },
  "h4": {
    "name": "Heading 4",
    "children": ["inline"],
    "attributes": ["align"],
    "element": "h4"
  },
  "li": {
    "name": "List item",
    "parents": [
      "ul", "ol"
    ],
    "children": ["flow"],
    "attributes": [
      "type", "value"
    ],
    "element": "li"
  },
  "ul": {
    "name": "Unordered List",
    toggle: (controller)=>{
      return controller.insertElementAfter("ul")
      .appendChild("li").getCurrentContent()
    },
    "children": ["li"],
    "attributes": [
      "compact", "type"
    ],
    "element": "ul"
  },
  "address": {
    "name": "Address",
    "children": [
      "inline", "p"
    ],
    "element": "address"
  },
  "table": {
    "name": "Table",
    toggle: (controller)=>{

      return controller.insertElementAfter("table")
      .appendChild("tbody")
      .appendChild("tr")
      .appendChildren("td", 2)
      .getCurrentContent()
    },
    "children": [
      "tbody",
      "caption",
      "colgroup",
      "col",
      "thead",
      "tfoot"
    ],
    "attributes": [
      "align",
      "bgcolor",
      "border",
      "cellpadding",
      "cellspacing",
      "frame",
      "rules",
      "summary",
      "width"
    ],
    "element": "table"
  },
  "td": {
    "name": "Cell",
    toggle: (controller)=>{
        const at_index = controller.getChildIndex()

        return controller.queryParent("tbody")
          .queryAndAppend("tr","td", at_index).getCurrentContent()
    },
    "parents": ["tr"],
    "children": ["flow"],
    "attributes": [
      "abbr",
      "align",
      "axis",
      "bgcolor",
      "char",
      "charoff",
      "colspan",
      "headers",
      "height",
      "nowrap",
      "rowspan",
      "scope",
      "valign",
      "width"
    ],
    "element": "td"
  }
});

export default DefaultDraftBlockRenderMap;
