import React, {Component} from 'react';
import {
  Modifier,
  EditorState,
  CompositeDecorator,
} from 'draft-js';
import ContentController from '../../transactions/ContentController';
import DefaultDraftEntityArray from '../../immutables/DefaultDraftEntityArray';
import createEntityStrategy from '../../utils/createEntityStrategy';
import editorStateToJSON from '../../encoding/editorStateToJSON';
import editorContentsToHTML from '../../encoding/editorContentsToHTML';
import ControllerContainer from '../../components/ControllerContainer'
import RichEditor from '../../components/Editor'
import '../../App.css';
import '../../styles/app.scss';


const decorators = new CompositeDecorator(DefaultDraftEntityArray.map(
  (decorator) => {
    return {
      strategy: createEntityStrategy(decorator.name),
      component: decorator.component
    }
  }
));


class BobbobEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.set(EditorState.createEmpty(), {decorator: decorators}),
      readOnly: false,
      operations: []
    };

    this.controller = new ContentController(this.state.editorState)
    this.controller.onSave = this.onSave
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  onSave = () => {
    console.log('save')
  };

  setReadOnly = (readOnly) => {
    this.setState({readOnly})
  };

  handleKeyCommand = (command) => {
    if (command === "ctrl-s") {
      this.onSave()
    }
  };

  toggleSync = () => {
    this.setState({sync: !this.state.sync})
  };

  onChange = (editorState) => {
    if (editorState === this.state.editorState) {
      return
    }
    const prevContent = this.state.editorState.getCurrentContent();
    let currentContent = editorState.getCurrentContent();
    // console.log(convertToRaw(currentContent))
    const operations = currentContent.getOperations();
    const hashes = [];
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
    this.controller.index = this.controller.blocksArray.findIndex((block) => {
      return block.getKey() === this.controller.selection.getFocusKey()
    })

    this.setState({editorState})
  }

  onClick = (e) => {
    this.setState({clickTarget: e.target})
  }

  onHover = (e) => {
    if (e.target.dataset.entity) {
      this.setState({hoverTarget: e.target})
    }
  }

  toHtml = () => {
    let mainEditor = document.querySelector("[data-contents]")
    mainEditor = mainEditor.cloneNode(true)
    return editorContentsToHTML(mainEditor)
  }

  render() {
    return (
      <div className="App" style={{margin: "auto"}}>
        {this.state.editorState ?
          <div className={`editor-${this.state.themename}`}>
            <ControllerContainer
              controller={this.controller}
              onChange={this.onChange}
              setReadOnly={this.setReadOnly}
              hoverTarget={this.state.hoverTarget}
              clickTarget={this.state.clickTarget}
            />
            <button onClick={() => {
              console.log(editorStateToJSON(this.state.editorState))
            }}>logJSON
            </button>
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

          </div> : null}

      </div>
    );
  }
}


export default BobbobEditor;
