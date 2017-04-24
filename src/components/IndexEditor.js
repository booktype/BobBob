import React from 'react'
import contentRendererFn from '../renderers/contentRendererFn';
import leafRendererFn from '../renderers/leafRendererFn';
import DefaultDraftBlockRenderMap from '../immutables/DefaultDraftBlockRenderMap';
import DefaultDraftInlineStyle from '../immutables/DefaultDraftInlineStyle';
import createEntityStrategy from '../utils/createEntityStrategy';
import ControllerContainer from './ControllerContainer'
import InlineStyleControls from './InlineStyleControls'
import Draft, {
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  Editor, EditorState, RichUtils, CompositeDecorator} from 'draft-js';
import ContentState from 'draft-js/lib/ContentState';
import DraftEntityInstance from 'draft-js/lib/DraftEntityInstance';
import ContentController from '../transactions/ContentController';
import {Map} from 'immutable';
import './RichEditor.css';
import convertTemplatetoContentBlocks from '../encoding/convertTemplatetoContentBlocks'

const isSelectionAtEndOfBlock = (editorState) => {
  const selection = editorState.getSelection()
  const contentState = editorState.getCurrentContent()
  const focusBlock = contentState.getBlockForKey(selection.getFocusKey())
  if(selection.getFocusOffset() === focusBlock.getText().length){
    return true
  }
  return false

}
class IndexEditor extends React.Component {
  constructor(props) {
    super(props);
    const content = convertTemplatetoContentBlocks(props.template, props.entities)

    let editorState = EditorState.createWithContent(
      new ContentState(content)
    )
    this.controller = new ContentController(editorState)
    this.state = {
      editorState
    }
  }
  handleKeyCommand = (command) => {
    switch (command){
      case "split-block":
        this.setState({
          editorState: RichUtils.insertSoftNewline(this.state.editorState)
        })
        return "handled";
      case "delete":
        if(isSelectionAtEndOfBlock(this.state.editorState)){
          return "handled"
        }
      case "backspace":
        if(this.state.editorState.getSelection().getFocusOffset()===0){
          return "handled"
        }
    }
  }
  onChange=(editorState)=>{
    this.controller = new ContentController(editorState)
    const currentContent = editorState.getCurrentContent()
    const blockMap = currentContent.getBlockMap()
    let entities = Map()
    blockMap.forEach((block)=>{
      const entityKey = block.getData().get("entity")
      if(entityKey){
        const charList = block.getCharacterList()
        const entityMap = {}
        charList.forEach((char)=>{
          const key = char.getEntity()
          if(key){
            const subEntity = currentContent.getEntity(key)
            entityMap[key]=subEntity
          }
        })
        entities = entities.set(entityKey, new DraftEntityInstance({
          type: this.props.entities.get(entityKey).getType(),
          mutability: this.props.entities.get(entityKey).getMutability(),
          data:{
            entityMap,
            text: block.getText(),
            characterList: block.getCharacterList()
          }
        }))
      }
    })
    console.log(entities.toJSON())
    this.props.onChange(entities)
    console.log(entities)
    this.setState({
      editorState
    })

  }
  customStyleFn=(style, block) =>{
    if(style.includes("__")){
       const [property, value] = style.split("__")
       return {
         [property]: value
       }
    }
  }
  render(){
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
    )

  }
}
export default IndexEditor
