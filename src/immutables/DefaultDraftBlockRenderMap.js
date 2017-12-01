import {Map} from 'immutable';
import React from 'react';
// onSplitBlock
// backspaceOnBlockStart
// deleteOnBlockEnd
// onBlock
// onEnable
// onDisable

const DefaultDraftBlockRenderMap = Map({
  'firstblock': {
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
  'svg': {
    element: 'svg',
    "children": ["path"],
  },
  'path': {
    element: 'path',
    void: true
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
    "element": "th",

  },
  "page-break": {
    "name": "Page Break",
    element: (props)=>{
      const onChange = props.children.props.blockProps.onChange;
      const editorState = props.children.props.blockProps.editorState;
      console.log(onChange, editorState);
      return (
        <div 
          className="PageBreakEditor flex items-center justify-center pa0 mv2 dim pointer" 
        >
          <svg className="w1"  data-icon="info" viewBox="0 0 24 24">
            <path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z">
            </path>
          </svg>
        </div>
      );
    }
  },
  "hr": {
    "name": "Separator",
    "attributes": [
      "align", "noshade", "size", "width"
    ],
    "element": "hr",
    "void": true,
    command: {
      character: (controller) => {
        return controller;
      },
      selection: (controller) => {
        return false;
      },
      enter: (controller) => {
        return controller;
      }

    }
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
    toggle: (controller) => {
      return controller.insertElementAfter("ol")
        .appendChild("li").getCurrentContent();
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
    "element": "h1",
    "command": {
      enter: (controller)=>{
        if (controller.isSelectionAtEndOfBlock()) {
          return controller.splitBlock().selectNextBlock().toggleBlockType('unstyled');
        }
        return controller.splitBlock();
      }
    }
  },
  "tr": {
    "name": "Row",
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
    "element": "li",
    "command": {
      enter: (controller) => {
        if (controller.isBlockEmpty()) {
          if (controller.nextBlock.getType()==='li') {
            const listBlock = controller.location[0];
            return controller.toggleBlockType('unstyled')
            .selectNextBlock()
            .insertElementBefore(listBlock.getType())
            .adjustBlockDepth(-1);
          }
          return controller.toggleBlockType('unstyled');
        }
        return controller.splitBlock();
      },
      backspace: (controller) => {
        if (controller.isSelectionAtStartOfBlock()) {
          if (controller.location.length === 2) {
            if (controller.isBlockEmpty()) {
              return controller;
            }
          } 
        }

      }
    }
  },
  "ul": {
    "name": "Unordered List",
    toggle: (controller) => {
      return controller.insertElementAfter("ul")
        .appendChild("li").getCurrentContent();
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
    "command": {
      tab: (controller) => {
        return controller.queryAndSelect('td', 1);
      },
      delete: (controller) => {
        if (controller.isSelectionAtEndOfBlock()) {
          return controller;
        }
      },
      backspace: (controller) => {
        if (controller.isSelectionAtStartOfBlock()) {
          return controller;
        }
      },
      enter: (controller) => {
        return controller.insertSoftNewLine();
      }
    }, 
    "element": "td"
  }
});

export default DefaultDraftBlockRenderMap;
