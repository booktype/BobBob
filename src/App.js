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
// import msgpack from 'msgpack-lite';

var worker = new Worker('/static/edit/js/draft/worker.js')
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
    worker.onmessage = (e)=>{
      let editorState = null;
      switch (e.data.command) {
        case "newcontent":
          let content  = convertRawToDraftState(e.data.content)
          editorState = EditorState.createWithContent(
            Modifier.enableOT(content),
            decorators
          )
          this.controller = new ContentController(editorState)

          break;
        case "updatecontent":
          editorState = EditorState.set(
            this.state.editorState,
            {
              currentContent: convertRawToDraftState(e.data.content),
            }
          )
          break;
      }
      this.setState({
        editorState
      })
    }
    worker.postMessage({
      command: "createorload",
      name: this.name
    })
    this.state = {
      editorState: '',
      sync: false,
      readOnly: false
    };
  }
  onSave = ()=>{
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
      worker.postMessage({
        command: "save",
      })
    }
  }
  handleBeforeInput = (chars)=>{
  }
  handleCursor = (command)=>{
  }
  toggleSync = ()=>{
    worker.postMessage({command: "sync", value: !this.state.sync})
    console.log("sync is" , !this.state.sync)
    this.setState({sync:!this.state.sync})
  }
  onChange= (editorState) =>{
    console.log("change")
    if(editorState===this.state.editorState){
      return
    }
    const prevContent = this.state.editorState.getCurrentContent()
    let currentContent = editorState.getCurrentContent()
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
    // if(e.target.dataset.entity){
    //   console.log(e.target.dataset.entity)
    //   const entity = this.controller.currentContent.getEntity(e.target.dataset.entity)
    //   this.setState({
    //     modalActive: true,
    //     modalTitle: entity.getType(),
    //     modalChildren: "this is where the children go"
    //   })
    // }
  }
  onHover=(e)=>{
    this.setState({hoverTarget:e.target})

  }
  render() {
    return (
      <div className="App">
        {/* <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div> */}
{this.state.editorState?
        <div>
          <ControllerContainer
            controller={this.controller}
            onChange={this.onChange}
            setReadOnly={this.setReadOnly}
            hoverTarget={this.state.hoverTarget}
            clickTarget={this.state.clickTarget}
          />
            <RichEditor ref="editor"
              readOnly={this.state.readOnly}
              onClick={this.onClick}
              onMouseOver={this.onHover}
              onSave={this.onSave}
              handleKeyCommand={this.handleKeyCommand}
              handleBeforeInput={this.handleBeforeInput}
              onChange={this.onChange} editorState={this.state.editorState}/>

        </div>:null}
      </div>
    );
  }
}
export default App;
