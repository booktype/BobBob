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
var messenger = require('rtc-switchboard-messenger');
var signaller = require('rtc-signaller')(messenger('http://localhost:8997/'));


// send through an announce message
// this will occur once the websocket has been opened and active
signaller.announce({ room: document.location.pathname });

var jsondiffpatch = require('jsondiffpatch').create({
    // used to match objects when diffing arrays, by default only === operator is used
    objectHash: function(obj) {
        // this function is used only to when objects are not equal by ref
        return obj.key;
    },
    arrays: {
        // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
        detectMove: false,
        // default false, the value of items moved is not included in deltas
        includeValueOnMove: false
    },
    textDiff: {
        // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
        minLength: 3
    },
    // propertyFilter: function(name, context) {
    //   /*
    //    this optional function can be specified to ignore object properties (eg. volatile data)
    //     name: property name, present in either context.left or context.right objects
    //     context: the diff context (has context.left and context.right objects)
    //   */
    //   return name.slice(0, 1) !== '$';
    // },
    nested: false,
    cloneDiffValues: false /* default false. if true, values in the obtained delta will be cloned
      (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects.
       this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
      instead of true, a function can be specified here to provide a custom clone(value)
      */
});
class App extends Component {
  constructor(props){
    super(props)
    const decorators = new CompositeDecorator(DefaultDraftEntityArray.map(
      (decorator)=>{
        return {
          strategy: createEntityStrategy(decorator.name),
          component: decorator.component
        }
    }))
    this.state = {
      editorState: EditorState.createEmpty(decorators)
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
  handleBeforeInput = (chars)=>{
    // signaller.send("/chars", {chars, selection:this.state.editorState.getSelection()})
  }
  handleCursor = (command)=>{
    // signaller.send("/chars", {command, selection:this.state.editorState.getSelection()})
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
    const transform = generateTransformation(this.state.editorState, editorState)
    if(transform){
      if(transform.text){
        signaller.send('/ottext', transform.text)
      }else{
        signaller.send('/otblocks', transform.blocks)

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
          <h2>Welcome to React</h2>
        </div>
        <ControllerContainer
          controller={this.controller}
          onChange={this.onChange}
        />
        <RichEditor ref="editor"
          handleKeyCommand={this.handleKeyCommand}
          handleBeforeInput={this.handleBeforeInput}
          onChange={this.onChange} editorState={this.state.editorState}/>
      </div>
    );
  }
}
export default App;
