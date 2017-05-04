import React, { Component } from 'react';
import logo from './logotext.png';
import './App.css';
import RichEditor from './components/Editor'
import ControllerContainer from './components/ControllerContainer'
import { convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  Editor, EditorState, RichUtils,
  SelectionState, CompositeDecorator,
  ContentState} from 'draft-js';
import {BlockMapBuilder, Modifier} from 'draft-js'
import ContentController from './transactions/ContentController';
import DefaultDraftEntityArray from './immutables/DefaultDraftEntityArray';
import createEntityStrategy from './utils/createEntityStrategy';
import diffConvertFromDraftStateToRaw from './encoding/diffConvertDraftStateToRaw'
import convertRawToDraftState from './encoding/convertRawToDraftState'
import axios from "axios";
import editorStateToJSON from './encoding/editorStateToJSON';
import editorStateFromRaw from './encoding/editorStateFromRaw';
import editorContentsToHTML from './encoding/editorContentsToHTML';
import onPaste from './handlers/onPaste'

import './styles/app.scss';

// var worker = new Worker('../_worker')
// var worker = {
//   postMessage: ()=>{}
// }

const decorators = new CompositeDecorator(DefaultDraftEntityArray.map(
  (decorator)=>{
    return {
      strategy: createEntityStrategy(decorator.name),
      component: decorator.component
    }
  }
))

class App extends Component {
  constructor(props){
    super(props)
    this.name = document.location.pathname.replace("/","")
    // worker.onmessage = (e)=>{
    //   let editorState = null;
    //   switch (e.data.command) {
    //     case "newcontent":
    //       let content  = convertRawToDraftState(e.data.content)
    //       editorState = EditorState.createWithContent(
    //         Modifier.enableOT(content),
    //         decorators
    //       )
    //       this.controller = new ContentController(editorState)
    //
    //       break;
    //     case "updatecontent":
    //       editorState = EditorState.set(
    //         this.state.editorState,
    //         {
    //           currentContent: convertRawToDraftState(e.data.content),
    //         }
    //       )
    //       break;
    //   }
    //   this.setState({
    //     editorState
    //   })
    // }
    // worker.postMessage({
    //   command: "createorload",
    //   name: this.name,
    //   hash: document.location.hash,
    //   pathname: document.location.pathname
    // })
    this.state = {
      editorState: '',
      sync: false,
      readOnly: false
    };

    setTimeout(()=>{
      const chapter_url = `/_api/books/${window.booktype.currentBookID}/chapters/${window.document.location.hash.replace("#edit/","")}/`
      axios
      .get(chapter_url)
      .then((response)=>{
        const editorState = onPaste(EditorState.createEmpty(), response.data.content)
        // const editorState = editorStateFromRaw(JSON.parse(response.data.content_json))

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
  componentDidMount(){
    if(this.name){
    }

  }

  handleKeyCommand = (command)=>{
    if(command==="ctrl-s"){
      console.log("Save")
      this.onSave()
      // worker.postMessage({
      //   command: "save",
      // })
    }
  }
  handleBeforeInput = (chars)=>{
  }
  handleCursor = (command)=>{
  }
  toggleSync = ()=>{
    // worker.postMessage({command: "sync", value: !this.state.sync})
    console.log("sync is" , !this.state.sync)
    this.setState({sync:!this.state.sync})
  }
  onChange= (editorState) =>{
    if(editorState===this.state.editorState){
      return
    }
    const prevContent = this.state.editorState.getCurrentContent()
    let currentContent = editorState.getCurrentContent()
    console.log(convertToRaw(currentContent))
    const operations = currentContent.getOperations()

    operations.forEach((operation, contentHash)=>{
      const operationName = operation[0]
      const operationArgs = operation[1]
      operationArgs.forEach((arg)=>{
        if(arg)
        console.log(arg.constructor.name)
      })
    })
    currentContent = Modifier.clearOperations(currentContent)
    editorState = EditorState.set(editorState, {currentContent})
    // if(prevContent.getBlockMap()!==currentContent.getBlockMap() ||
    //    prevContent.getEntityMap()!==currentContent.getEntityMap()
    //   ){
    //   worker.postMessage({
    //     command: "update",
    //     change: diffConvertFromDraftStateToRaw(
    //       prevContent,
    //       currentContent
    //     )
    //   })
    //
    // }
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
    this.setState({clickTarget:e.target})
  }
  onHover=(e)=>{
    this.setState({hoverTarget:e.target})
  }
  toHtml = () => {
    let mainEditor = document.querySelector("[data-contents]")
    mainEditor = mainEditor.cloneNode(true)
    return editorContentsToHTML(mainEditor)
  }
  render() {
    return (
      <div className="App">
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
export default App;
