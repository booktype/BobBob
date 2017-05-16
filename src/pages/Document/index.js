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
import client from '../../feathers';
import transit from 'transit-immutable-js';
import '../../styles/app.scss';

const DraftTransit = transit.withRecords([SelectionState, ContentBlock, CharacterMetadata])

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
    this.state = {
      collection_id: this.props.match.params.collection,
      document_id: this.props.match.params.document,
      editorState:"",
      readOnly: false,
      operations: []
    };
    this.documentsService = client.service('documents')
    this.otService = client.service('ot')
    console.log(client)
  }
  onSave = ()=>{
    this.documentsService.patch(this.state.document_id, {
      contentState: convertToRaw(this.state.editorState.getCurrentContent())
    })
  }
  setReadOnly=(readOnly)=>{
    this.setState({readOnly})
  }
  componentDidMount(){
    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().then((login)=>{
      client.passport.verifyJWT(login.accessToken).then((decoded)=>{
        this.documentsService.get(this.props.match.params.document).then(doc=>{
          let content;
          if(!doc.contentState){
            content = ContentState.createFromText("")
          }else{
             content = convertFromRaw(doc.contentState)
          }
          content = Modifier.enableOT(content)
          this.otService.on("join", (ot)=>{
            console.log("join",ot)

            // this.setState({socketId: ot.socketId})
          })
          this.otService.on("operation", (ot)=>{
            if(!this.state.operations.includes(ot.data.contentHash)){
              content = this.state.editorState.getCurrentContent()
              console.log(ot.data.userId)
              const args = DraftTransit.fromJSON(ot.data.operationArgs)
              content = Modifier[ot.data.operationName](content, ...args)
              content = Modifier.clearOperations(content)
              this.onChange(EditorState.set(this.state.editorState,
                {currentContent: content}
              ))
            }
          })
          this.otService.create({
            collection: this.state.collection_id,
            document: this.state.document_id,
          })
          let editorState = EditorState.createWithContent(content, decorators)
          this.controller = new ContentController(editorState)
          this.controller.userId = decoded.userId
          this.setState({document: doc, editorState})
        })
      })

    }).catch(() => this.setState({ login: null }));
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

    operations.forEach((operation, contentHash)=>{
      this.setState({operations: [...this.state.operations, contentHash]})
      const operationName = operation[0]
      const operationArgs = DraftTransit.toJSON(operation[1])

      this.otService.update(this.state.document_id, {
        operationName, operationArgs
        , contentHash
      })
    })
    currentContent = Modifier.clearOperations(currentContent)
    editorState = EditorState.set(editorState, {currentContent})
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
      <div className="App" style={{width: "50%", margin: "auto"}}>
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
