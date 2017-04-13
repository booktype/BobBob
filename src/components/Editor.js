import React from 'react'
import contentRendererFn from '../renderers/contentRendererFn';
import leafRendererFn from '../renderers/leafRendererFn';
import DefaultDraftBlockRenderMap from '../immutables/DefaultDraftBlockRenderMap';
import DefaultDraftInlineStyle from '../immutables/DefaultDraftInlineStyle';
import DefaultDraftEntityArray from '../immutables/DefaultDraftEntityArray';
import keycodes from '../constants/keycodes'
import onPaste from '../handlers/onPaste'
import createEntityStrategy from '../utils/createEntityStrategy';
import ControllerContainer from './ControllerContainer'
import Draft, {
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  Editor, EditorState, RichUtils, CompositeDecorator} from 'draft-js';
import ContentController from '../transactions/ContentController';
import './RichEditor.css';
function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}
function editorStateToJSON(editorState) {
  if (editorState) {
    const content = editorState.getCurrentContent();
    return JSON.stringify(convertToRaw(content), null, 2);
  }
}
function editorStateFromRaw(rawContent) {
  if (rawContent) {
    const content = convertFromRaw(rawContent);
    return EditorState.createWithContent(content);
  } else {
    return EditorState.createEmpty();
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
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
  }
  customStyleFn=(style, block) =>{
    if(style.includes("__")){
       const [property, value] = style.split("__")
       return {
         [property]: value
       }
    }
  }

  _keyBindingFn(e){
      let command = []
      const key = keycodes[e.keyCode.toString()]
      if (key) {
        if (e.ctrlKey) {
          command.push("ctrl")
        }
        if (e.shiftKey) {
          command.push("shift")
        }
        if (e.altKey) {
          command.push("alt")
        }
        command.push(key)
        command = command.join("-")
    }
    if(command=="ctrl-s"){
      this.props.handleKeyCommand(command)
      e.preventDefault()
    }
    return getDefaultKeyBinding(e);
  }
  _handleKeyCommand(command) {
    this.props.handleKeyCommand(command)
    const {editorState} = this.state;
    console.log(command)
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }



  _onPaste = (text, html) => {
    if(html){
      this.props.onChange(onPaste(this.props.editorState, html))
      return true
    }else{
      return false
    }
  }
  render() {
    const {editorState} = this.props;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">

        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleFn={this.customStyleFn}
            customStyleMap={DefaultDraftInlineStyle}
            blockRenderMap={DefaultDraftBlockRenderMap}
            leafRendererFn={leafRendererFn}
            contentRendererFn={contentRendererFn}
            editorState={this.props.editorState}
            handleKeyCommand={this.props.handleKeyCommand}
            keyBindingFn={this._keyBindingFn}
            onChange={this.props.onChange}
            handlePastedText={this._onPaste}
            handleBeforeInput={this.props.handleBeforeInput}
            onTab={this.onTab}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}
export default RichEditor;
