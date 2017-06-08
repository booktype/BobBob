import React, { Component } from 'react';
import logo from '../../logotext.png';
import '../../App.css';
import RichEditor from '../../components/Editor'
import ControllerContainer from '../../components/ControllerContainer'
import { convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  Editor, EditorState, RichUtils,
  SelectionState, CompositeDecorator,
  ContentBlock, CharacterMetadata,
  ContentState} from 'draft-js';
import {BlockMapBuilder, Modifier} from 'draft-js'
import ContentController from '../../transactions/ChainModifier';
import DefaultDraftEntityArray from '../../immutables/DefaultDraftEntityArray';
import createEntityStrategy from '../../utils/createEntityStrategy';
import convertRawToDraftState from '../../encoding/convertRawToDraftState'
import editorStateToJSON from '../../encoding/editorStateToJSON';
import editorStateFromRaw from '../../encoding/editorStateFromRaw';
import editorContentsToHTML from '../../encoding/editorContentsToHTML';
import onPaste from '../../handlers/onPaste';
import '../../styles/app.scss';
import axios from "axios";

const decorators = new CompositeDecorator(DefaultDraftEntityArray.map(
  (decorator)=>{
    return {
      strategy: createEntityStrategy(decorator.name),
      component: decorator.component
    }
  }
))

class BooktypeEditor extends Component {
  constructor(props){
    super(props)

    this.state = {
      editorState:"",
      readOnly: false,
      operations: []
    };
    setTimeout(()=>{
      const chapter_url = `/_api/books/${window.booktype.currentBookID}/chapters/${window.document.location.hash.replace("#edit/","")}/`
      axios
      .get(chapter_url)
      .then((response)=>{
        // const editorState = onPaste(EditorState.createEmpty(), response.data.content)
        const editorState = editorStateFromRaw(JSON.parse(response.data.content_json))

        this.controller = new ContentController(editorState)

        this.setState({
            editorState: EditorState.set(editorState, {decorator:decorators})
        })
      })
      let csrftoken = window.booktype.getCookie('csrftoken');
      window.booktype.editor.edit.saveContent = () => {
        const editorState = editorStateToJSON(this.state.editorState)
        axios.patch(chapter_url,{content_json:editorState, content: this.toHtml()},{headers:{
          "X-CSRFToken": csrftoken
        }})
      }
      const defaultSetTheme = window.booktype.editor.themes.setTheme
      window.booktype.editor.themes.setTheme = (themename) => {
        this.setTheme(themename)
        defaultSetTheme(themename)
      }

    },9000)
  }
  onSave = ()=>{
    window.booktype.editor.edit.saveContent()
  }
  setReadOnly=(readOnly)=>{
    this.setState({readOnly})
  }

  handleKeyCommand = (command)=>{
    if(command==="ctrl-s"){
      this.onSave()
    }
  }
  toggleSync = ()=>{
    this.setState({sync:!this.state.sync})
  }
  onChange= (editorState) =>{
    if(editorState===this.state.editorState){
      return
    }
    const prevContent = this.state.editorState.getCurrentContent()
    let currentContent = editorState.getCurrentContent()
    // console.log(convertToRaw(currentContent))
    const operations = currentContent.getOperations()
    const hashes = []
    this.setState({operations: this.state.operations.concat(hashes)})
    currentContent = Modifier.clearOperations(currentContent)
    editorState = EditorState.set(editorState, {currentContent})
    this.controller.updateEditorState(editorState.getCurrentContent(), editorState.getSelection())
    const previousBlocksArray = this.controller.blocksArray
    this.controller.editorState = editorState
    this.controller.currentContent = editorState.getCurrentContent()
    this.controller.currentInlineStyle = editorState.getCurrentInlineStyle()
    this.controller.blocksArray = this.controller.currentContent.getBlocksAsArray()
    this.controller.selection = editorState.getSelection()
    this.controller.currentBlock = this.controller.currentContent.getBlockForKey(this.controller.selection.getAnchorKey())
    this.controller.currentDepth = this.controller.currentBlock.getDepth()
    this.controller.index = this.controller.blocksArray.findIndex((block)=>{
      return block.getKey()===this.controller.selection.getFocusKey()
    })

    this.setState({editorState})
  }
  onClick=(e)=>{
    console.log(e.target)
    this.setState({clickTarget:e.target})
  }
  onHover=(e)=>{
    if(e.target.dataset.entity){
      this.setState({hoverTarget:e.target})
    }
  }
  toHtml = () => {
    let mainEditor = document.querySelector("[data-contents]")
    mainEditor = mainEditor.cloneNode(true)
    return editorContentsToHTML(mainEditor)
  }
  render() {
    return (
      <div className="App" style={{width: "80%", margin: "auto"}}>
        {this.state.editorState?
        <div className={`editor-${this.state.themename}`}>
          <ControllerContainer
            controller={this.controller}
            onChange={this.onChange}
            setReadOnly={this.setReadOnly}
            hoverTarget={this.state.hoverTarget}
            clickTarget={this.state.clickTarget}
          />
            <button onClick={()=>{console.log(editorStateToJSON(this.state.editorState))}}>logJSON</button>
            <RichEditor ref="editor"
              readOnly={this.state.readOnly}
              onClick={this.onClick}
              onMouseOver={this.onHover}
              onSave={this.onSave}
              handleKeyCommand={this.handleKeyCommand}
              handleBeforeInput={this.handleBeforeInput}
              onChange={this.onChange}
              editorState={this.state.editorState}
            />

        </div>:null}

      </div>
    );
  }
}
export default BooktypeEditor;
