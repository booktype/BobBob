import React from 'react';
import {
  getDefaultKeyBinding,
  Editor,
  RichUtils
} from 'draft-js';
import contentRendererFn from '../renderers/contentRendererFn';
import leafRendererFn from '../renderers/leafRendererFn';
import blockRendererFn from '../renderers/blockRendererFn';
import DefaultDraftBlockRenderMap from '../immutables/DefaultDraftBlockRenderMap';
import DefaultDraftInlineStyle from '../immutables/DefaultDraftInlineStyle';
import keycodes from '../constants/keycodes';
import onPaste from '../handlers/onPaste';
import './RichEditor.css';


function getBlockStyle(block) {
  switch (block.getType()) {
    default:
      return null;
  }
}


class RichEditor extends React.Component {
  constructor(props) {
    super(props);


    this.focus = () => this.refs.editor.focus();
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  _onTab(e) {
    e.preventDefault();
    this.props.handleKeyCommand('tab');
  }

  customStyleFn = (style, block) => {
    if (style.includes("__")) {
      const [property, value] = style.split("__");
      return {
        [property]: value
      };
    }
  }

  _keyBindingFn = (e) => {
    let command = [];
    const key = keycodes[e.keyCode.toString()];
    if (key) {
      if (e.ctrlKey) {
        command.push("ctrl");
      }
      if (e.shiftKey) {
        command.push("shift");
      }
      if (e.altKey) {
        command.push("alt");
      }
      command.push(key);
      command = command.join("-");
    }
    if (this.props.handleKeyCommand(command)) {
      return "handled";
    }
    if (command === "ctrl-s") {
      e.preventDefault();
      this.props.handleKeyCommand(command);
    }
    if (command === "ctrl-enter") {

      this.props.onChange(RichUtils.insertSoftNewline(this.props.editorState));
      return "handled";
    }
    return getDefaultKeyBinding(e);
  }

  _handleKeyCommand(command) {
    this.props.handleKeyCommand(command);
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  handleDroppedFiles = (selection, files) => {
    if (files[0].name.endsWith("docx")) {
    }
  }

  _onPaste = (text, html) => {
    if (html) {
      this.props.onChange(onPaste(this.props.editorState, html));
      return true;
    } else {
      return false;
    }
  }
  render() {

    let className = 'RichEditor-editor pa4';
    return (
      <div className="contentContainer">
        <div className="RichEditor-root br bl bb b--moon-gray" id="contenteditor">
          <div className={className} onClick={this.props.onClick} onMouseOver={this.props.onMouseOver}>
            <Editor
              readOnly={this.props.readOnly}
              blockStyleFn={getBlockStyle}
              customStyleFn={this.customStyleFn}
              customStyleMap={DefaultDraftInlineStyle}
              blockRenderMap={DefaultDraftBlockRenderMap}
              leafRendererFn={leafRendererFn}
              contentRendererFn={contentRendererFn}
              blockRendererFn={() => {
                return {
                  component: blockRendererFn,
                  editable: true,
                  props: {
                    editorState: this.props.editorState,
                    onChange: this.props.onChange
                  }
                };
              }}
              editorState={this.props.editorState}
              handleKeyCommand={this.props.handleKeyCommand}
              keyBindingFn={this._keyBindingFn}
              onChange={this.props.onChange}
              handlePastedText={this._onPaste}
              handleDroppedFiles={this.handleDroppedFiles}
              handleBeforeInput={this.props.handleBeforeInput}
              onTab={this.onTab}
              placeholder="Tell a story..."
              ref="editor"
              spellCheck={true}
            />
          </div>
        </div>
      </div>

    );
  }
}


export default RichEditor;
