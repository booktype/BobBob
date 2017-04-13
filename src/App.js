import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RichEditor from './components/Editor'
import ControllerContainer from './components/ControllerContainer'
import { convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  Editor, EditorState, RichUtils,
  SelectionState, CompositeDecorator,
  ContentState} from 'draft-js';
import ContentController from './transactions/ContentController';
import DefaultDraftEntityArray from './immutables/DefaultDraftEntityArray';
import createEntityStrategy from './utils/createEntityStrategy';
import generateTransformation from './generators/generateTransformationForEditorState'
import Transformation from './immutables/Transformation';
import applyTransformationToEditorState from './transactions/applyTransformationToEditorState';
import DataStore from 'nedb';
var messenger = require('rtc-switchboard-messenger');
var signaller = require('rtc-signaller')(messenger(document.location.protocol+"//"+document.location.hostname+':8997/'));

// send through an announce message
// this will occur once the websocket has been opened and active

class App extends Component {
  constructor(props){
    super(props)
    const decorators = new CompositeDecorator(DefaultDraftEntityArray.map(
      (decorator)=>{
        return {
          strategy: createEntityStrategy(decorator.name),
          component: decorator.component
        }
        if(document.location.pathname){
          signaller.announce({ room: document.location.pathname });
          // Type 3: Persistent datastore with automatic loading
          var Datastore = require('nedb')
          this.db = new Datastore({ filename: document.location.pathname, autoload: true });
          this.db.findOne({name: document.location.pathname}, function(err, doc){
            console.log(doc,err)
          })
        }
    }))
    this.state = {
      editorState: EditorState.createEmpty(decorators),
      sync: false
    };

    this.controller = new ContentController(this.state.editorState)
    // when a new peer is announced, log it
  }
  componentDidMount(){

    signaller.on('peer:announce', (data) => {
     console.log('new peer found in room: ', data);
    //  signaller.send('/setstate', convertToRaw(this.state.editorState.getCurrentContent()))
    });

    signaller.on('message:otblocks', (content)=>{
      this.setState({
        editorState: applyTransformationToEditorState({blocks:new Transformation(content)}, this.state.editorState)
      })
    })
    signaller.on('message:ottext', (content)=>{
      console.log(content, Transformation)
      this.setState({
        editorState: applyTransformationToEditorState({text:new Transformation(content)}, this.state.editorState)
      })
    })
    // for our sanity, pop a message once we are connected
    signaller.once('connected', function(data) {
      console.log('we have successfully connected', data);
    });

  }
  handleKeyCommand = (command)=>{
    if(command==="ctrl-s"){

    }
  }
  handleBeforeInput = (chars)=>{
    // signaller.send("/chars", {chars, selection:this.state.editorState.getSelection()})
  }
  handleCursor = (command)=>{
    // signaller.send("/chars", {command, selection:this.state.editorState.getSelection()})
  }
  toggleSync = ()=>{
    this.setState({sync:!this.state.sync})
  }
  onChange= (editorState) =>{
    // const delta = jsondiffpatch.diff(
    //   convertToRaw(editorState.getCurrentContent()).blocks,
    //   convertToRaw(this.state.editorState.getCurrentContent()).blocks
    // )
    // if(delta){
    //   // signaller.send('/sync', convertToRaw(editorState.getCurrentContent()))
    //   signaller.send('/diff', delta)
    //
    // }
    if(this.state.sync){
      const transform = generateTransformation(this.state.editorState, editorState)
      if(transform){
        if(transform.text){
          signaller.send('/ottext', transform.text)
        }else{
          signaller.send('/otblocks', transform.blocks)

        }
      }
    }
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
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>BobBob</h2>
        </div>
        <ControllerContainer
          controller={this.controller}
          onChange={this.onChange}
        />
        <button onClick={this.toggleSync}>Sync {this.state.sync}</button>
        <RichEditor ref="editor"
          handleKeyCommand={this.handleKeyCommand}
          handleBeforeInput={this.handleBeforeInput}
          onChange={this.onChange} editorState={this.state.editorState}/>
      </div>
    );
  }
}
export default App;
