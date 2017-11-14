import React from 'react';
import {Map} from 'immutable';
import ContentState from 'draft-js/lib/ContentState';
import DraftEntityInstance from 'draft-js/lib/DraftEntityInstance';
import Draft, {
  EditorState,
  RichUtils
} from 'draft-js';


import contentRendererFn from '../renderers/contentRendererFn';
import leafRendererFn from '../renderers/leafRendererFn';
import DefaultDraftBlockRenderMap from '../immutables/DefaultDraftBlockRenderMap';
import DefaultDraftInlineStyle from '../immutables/DefaultDraftInlineStyle';
import InlineStyleControls from './InlineStyleControls';
import ContentController from '../transactions/ContentController';
import convertTemplatetoContentBlocks from '../encoding/convertTemplatetoContentBlocks';
import './RichEditor.css';


const isSelectionAtEndOfBlock = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const focusBlock = contentState.getBlockForKey(selection.getFocusKey());

  return selection.getFocusOffset() === focusBlock.getText().length;
};


class IndexEditor extends React.Component {
  constructor(props) {
    super(props);
    const content = convertTemplatetoContentBlocks(props.template, props.entities);

    let editorState = EditorState.createWithContent(
      new ContentState(content)
    );

    this.controller = new ContentController(editorState);
    this.state = {
      editorState
    };
  }

  handleKeyCommand = (command) => {
    // eslint-disable-next-line
    switch (command) {
      case "split-block":
        this.setState({
          editorState: RichUtils.insertSoftNewline(this.state.editorState)
        });
        return "handled";
      case "delete":
        if (isSelectionAtEndOfBlock(this.state.editorState)) {
          return "handled";
        }
        return "not-handled";
      case "backspace":
        if (this.state.editorState.getSelection().getFocusOffset() === 0) {
          return "handled";
        }
        return "not-handled";
    }
  };

  onChange = (editorState) => {
    this.controller = new ContentController(editorState);
    const currentContent = editorState.getCurrentContent();
    const blockMap = currentContent.getBlockMap();
    let entities = Map();

    blockMap.forEach((block) => {
      const entityKey = block.getData().get("entity");

      if (entityKey) {
        const charList = block.getCharacterList();
        const entityMap = {};
        charList.forEach((char) => {
          const key = char.getEntity();
          if (key) {
            // subentity
            entityMap[key] = currentContent.getEntity(key);
          }
        });
        entities = entities.set(entityKey, new DraftEntityInstance({
          type: this.props.entities.get(entityKey).getType(),
          mutability: this.props.entities.get(entityKey).getMutability(),
          data: {
            entityMap,
            text: block.getText(),
            characterList: block.getCharacterList()
          }
        }));
      }
    });
    console.log(entities.toJSON());
    this.props.onChange(entities);
    console.log(entities);
    this.setState({
      editorState
    });
  };

  customStyleFn = (style, block) => {
    if (style.includes("__")) {
      const [property, value] = style.split("__");
      return {
        [property]: value
      };
    }
  };

  render() {
    return (
      <div className="RichEditor-root">
        <InlineStyleControls
          controller={this.controller}
          onChange={this.onChange}
        />
        <Draft.Editor
          customStyleFn={this.customStyleFn}
          customStyleMap={DefaultDraftInlineStyle}
          blockRenderMap={DefaultDraftBlockRenderMap}
          leafRendererFn={leafRendererFn}
          contentRendererFn={contentRendererFn}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          // keyBindingFn={this._keyBindingFn}
          onChange={this.onChange}
          ref="indexeditor"
          spellCheck={true}
        />
      </div>
    );
  }
}


export default IndexEditor;
