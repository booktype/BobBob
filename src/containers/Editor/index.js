import React, {Component} from 'react';
import {
  Modifier,
  EditorState,
  CompositeDecorator,
  SelectionState,
  ContentBlock,
  CharacterMetadata
} from 'draft-js';
import transit from 'transit-immutable-js';
import ContentController from '../../transactions/ContentController';
import DefaultDraftBlockRenderMap from '../../immutables/DefaultDraftBlockRenderMap';
import DefaultDraftEntityArray from '../../immutables/DefaultDraftEntityArray';
import createEntityStrategy from '../../utils/createEntityStrategy';
import editorStateToJSON from '../../encoding/editorStateToJSON';
import editorStateFromRaw from '../../encoding/editorStateFromRaw';
import editorContentsToHTML from '../../encoding/editorContentsToHTML';
import ControllerContainer from '../../components/ControllerContainer';
import RichEditor from '../../components/Editor';
import '../../styles/app.scss';


const DraftTransit = transit.withRecords([SelectionState, ContentBlock, CharacterMetadata]);

const decorators = new CompositeDecorator(DefaultDraftEntityArray.map(
  (decorator) => {
    return {
      strategy: createEntityStrategy(decorator.name),
      component: decorator.component
    };
  }
));


class BobbobEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: null,
      readOnly: false,
      operations: [],
      blockStyle: {style: {}, attributes: {}},
      inlineStyles: {},
      blockTree: {}
    };
    this.loadContent();

  }

  async loadContent() {
    const content = await this.props.api.getContent();
    let editorState = editorStateFromRaw(content);
    let currentContent = editorState.getCurrentContent();
    if (this.props.api.otEnabled) {
      currentContent = Modifier.enableOT(currentContent);
      this.props.api.ws.publish('init', {
        bookID: this.props.api.bookID,
        documentID: this.documentID,
        userID: this.props.api.userID
      });

      this.props.api.ws.publish('ready', {documentID: this.props.api.documentID});

      this.props.api.ws.subscribe = (message) => {
        let transformations = [];
        if (message.action === 'otChange') {
          transformations.push(message.args);
        } else if (message.action === 'syncChanges') {
          transformations = transformations.concat(message.args);
        } else {
          return;
        }
        let content = this.state.editorState.getCurrentContent();
        for (let ot of transformations) {
          if (!this.state.operations.includes(ot.contentHash)) {
            const args = DraftTransit.fromJSON(ot.operationArgs);
            content = Modifier[ot.operationName](content, ...args);
            content = Modifier.clearOperations(content);
          }
        }
        this.onChange(EditorState.set(this.state.editorState,
          {currentContent: content}
        ));
      };
    }

    editorState = EditorState.set(
      editorState,
      {
        currentContent: currentContent,
        decorator: decorators
      }
    );
    this.controller = new ContentController(editorState);
    this.controller.onSave = this.onSave;
    this.controller.api = this.props.api;
    this.setState({
      editorState
    });
  }

  onSave = () => {
    this.props.api.saveContent(editorStateToJSON(this.state.editorState));
    console.log(editorStateToJSON(this.state.editorState));
  };

  setReadOnly = (readOnly) => {
    this.setState({readOnly});
  };

  handleKeyCommand = (command) => {
    if (command === "ctrl-s") {
      this.onSave();
    }
    const blockType = DefaultDraftBlockRenderMap.get(this.controller.currentBlock.getType());
    if (blockType.command && blockType.command[command]) {
      const controller = blockType.command[command](this.controller);
      if (controller) {
        this.controller = controller;
        this.onChange(this.controller.editorState);
        return "handled";
      } else {
        return false;
      }
    }

  };
  onChange = (editorState) => {
    if (editorState === this.state.editorState) {
      return;
    }
    let operations = [];
    if (this.props.api.otEnabled) {
      let currentContent = editorState.getCurrentContent();
      operations = currentContent.getOperations();
      const hashes = [];
      operations.forEach((operation, contentHash) => {
        hashes.push(contentHash);
        const operationName = operation[0];
        const operationArgs = DraftTransit.toJSON(operation[1]);
        this.props.api.ws.otChange({
          operationName, operationArgs
          , contentHash
        });
      });
      operations = this.state.operations.concat(hashes);
      currentContent = Modifier.clearOperations(currentContent);
      editorState = EditorState.set(editorState, {currentContent});
    }
    this.controller.updateEditorState(
      editorState.getCurrentContent(),
      editorState.getSelection()
    );
    const inlineStyles = editorState.getCurrentInlineStyle().reduce(
      (styles, style) => {
        const [attr, value = true] = style.split("__");
        styles[attr] = value;
        return styles;
      },
      {}
    );
    const blockStyle = {
      type: this.controller.currentBlock.getType(),
      style: this.controller.currentBlock.getData().get('style') || {},
      attributes: this.controller.currentBlock.getData().get('attributes') || {}
    };
    if (this.controller.selection !== this.controller.previousSelection) {
      this.handleKeyCommand('selection');
    }
    this.setState({
      editorState,
      blockStyle,
      blockTree: this.controller.blockTree,
      inlineStyles,
      operations
    });
  };

  toHtml = () => {
    let mainEditor = document.querySelector("[data-contents]");
    mainEditor = mainEditor.cloneNode(true);
    return editorContentsToHTML(mainEditor);
  };

  render() {
    return (
      <div style={{margin: "auto"}}>
        {this.state.editorState ?
          <div>
            <div
              className={'contentHeader'}
            >
              <ControllerContainer
                inlineStyles={this.state.inlineStyles}
                blockStyle={this.state.blockStyle}
                blockTree={this.state.blockTree}
                controller={this.controller}
                onChange={this.onChange}
                setReadOnly={this.setReadOnly}
                // hoverTarget={this.state.hoverTarget}
                // clickTarget={this.state.clickTarget}
              />
            </div>
            <RichEditor
              // ref="editor"
              // readOnly={this.state.readOnly}
              onSave={this.onSave}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              editorState={this.state.editorState}
            />

          </div> : null}

      </div>
    );
  }
}


export default BobbobEditor;
