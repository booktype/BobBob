import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  Modifier,
  EditorState,
  CompositeDecorator,
} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import ContentController from '../../transactions/ContentController';
import DefaultDraftEntityArray from '../../immutables/DefaultDraftEntityArray';
import createEntityStrategy from '../../utils/createEntityStrategy';
import editorStateToJSON from '../../encoding/editorStateToJSON';
import editorStateFromRaw from '../../encoding/editorStateFromRaw';
import editorContentsToHTML from '../../encoding/editorContentsToHTML';
import ControllerContainer from '../../components/ControllerContainer'
import RichEditor from '../../components/Editor'
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
    this.loadContent();
    this.controller = new ContentController(this.state.editorState);
    this.controller.onSave = this.onSave;
    this.controller.api = this.props.api
  }

  componentDidMount(){
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: 'rgb(224, 223, 225)',
        accent1Color: 'rgb(255, 103, 0)'
      },
      appBar: {
        height: 50,
      },
    });
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        <ControllerContainer
          controller={this.controller}
          onChange={this.onChange}
          setReadOnly={this.setReadOnly}
          hoverTarget={this.state.hoverTarget}
          clickTarget={this.state.clickTarget}
        />
      </MuiThemeProvider>
      ,
      this.props.toolbarContainer
    )
  }
  async loadContent() {
    const content = await this.props.api.getContent();
    this.setState({
      editorState: editorStateFromRaw(content)
    })
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  onSave = () => {
    this.props.api.saveContent(editorStateToJSON(this.state.editorState));
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
    const operations = currentContent.getOperations();
    const hashes = [];
    this.setState({operations: this.state.operations.concat(hashes)});
    currentContent = Modifier.clearOperations(currentContent);
    editorState = EditorState.set(editorState, {currentContent});
    this.controller.updateEditorState(editorState.getCurrentContent(), editorState.getSelection());
    const previousBlocksArray = this.controller.blocksArray;
    this.controller.editorState = editorState;
    this.controller.currentContent = editorState.getCurrentContent();
    this.controller.currentInlineStyle = editorState.getCurrentInlineStyle();
    this.controller.blocksArray = this.controller.currentContent.getBlocksAsArray();
    this.controller.selection = editorState.getSelection();
    this.controller.currentBlock = this.controller.currentContent.getBlockForKey(this.controller.selection.getAnchorKey());
    this.controller.currentDepth = this.controller.currentBlock.getDepth();
    this.controller.index = this.controller.blocksArray.findIndex((block) => {
      return block.getKey() === this.controller.selection.getFocusKey()
    });

    this.setState({editorState})
  };

  onClick = (e) => {
    this.setState({clickTarget: e.target})
  };

  onHover = (e) => {
    if (e.target.dataset.entity) {
      this.setState({hoverTarget: e.target})
    }
  };

  toHtml = () => {
    let mainEditor = document.querySelector("[data-contents]");
    mainEditor = mainEditor.cloneNode(true);
    return editorContentsToHTML(mainEditor)
  };

  render() {
    return (
      <div  style={{margin: "auto"}}>
        {this.state.editorState ?
          <div className={`editor-${this.state.themename}`}>

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
