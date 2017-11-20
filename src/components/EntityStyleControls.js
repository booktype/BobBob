import React from 'react';
import {EditorState} from 'draft-js';
import {List, Map} from 'immutable';

import StyleButton from './StyleButton';
import Tooltip from './Tooltip';
import Modal from './Modal';
import IndexEditor from './IndexEditor';


const ENTITY_STYLES = [
  {
    label: 'Endnote', style: 'ENDNOTE',
    toggle: (props) => {
      const entityKey = props.controller.createEntity("ENDNOTE");
      props.controller.insertCharacterAtFocusWithEntity("\r", entityKey);
      return props.controller.getCurrentContent();
    },
  },
];


class EntityStyleControls extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tooltipActive: false,
      modalActive: false
    };
    this.currentEntities = List([]);

    // if(props.controller.selection.getAnchorKey()===props.controller.selection.getFocusKey()){
    //   currentEntities = props.controller.currentBlock.getCharacterList().slice(
    //     props.controller.selection.getAnchorOffset(), props.controller.selection.getFocusOffset()
    //   ).reduce((list, char)=>{
    //     return list.push(char.getEntity())
    //   },currentEntities)
    //   console.log(currentEntities)
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.clickTarget !== nextProps.clickTarget &&
      nextProps.clickTarget &&
      nextProps.clickTarget.dataset.entity
    ) {
      this.props.setReadOnly(true);
      const entity = this.props
        .controller.currentContent
        .getEntity(nextProps.clickTarget.dataset.entity);
      this.setState({
        modalActive: true,
        modalTitle: entity.getType(),
        modalType: entity.getType()
      });
    }

    if (
      this.props.hoverTarget !== nextProps.hoverTarget &&
      nextProps.hoverTarget &&
      nextProps.hoverTarget.dataset.entity && !this.state.tooltipActive
    ) {
      console.log("tooltip");
      const entity = nextProps.controller.currentContent.getEntity(nextProps.hoverTarget.dataset.entity);
      this.setState({
        tooltipActive: true,
        tooltipParent: nextProps.hoverTarget,
        tooltipText: entity.getData().text
      });
    } else if (this.state.tooltipActive) {
      this.setState({tooltipActive: false});
    }
  }

  renderModalChildren = (type) => {
    let entities = Map();
    window.document.querySelectorAll(`.${type.toLowerCase()}`)
      .forEach((element) => {
        const entity = this.props.controller.currentContent.getEntity(element.dataset.entity);
        // entity.key = element.dataset.entity
        entities = entities.set(element.dataset.entity, entity);
      });
    const template = `
      <ol>
        <li data-entry=true data-text=true>
        </li>
      </ol>
    `;

    return <IndexEditor
      entities={entities}
      template={template}
      onChange={(entities) => {
        console.log(entities);
        this.props.onChange(
          EditorState.set(this.props.controller.editorState, {
            currentContent: this.props.controller.currentContent.set("entityMap",
              this.props.controller.currentContent.getEntityMap().merge(entities)
            )
          })
        );
      }}
    />;
  };

  toggleEntity = (type, data) => {
    const entityKey = this.props.controller.createEntity("ENDNOTE", "MUTABLE", data);
    this.props.controller.insertCharacterAtSelectionEndWithEntity(" ", entityKey);

    const newEditorState = EditorState.set(this.props.controller.editorState, {
      currentContent: this.props.controller.getCurrentContent()
    });

    this.props.onChange(
      newEditorState
    );
  };

  renderModal = () => {
    if (this.state.modalActive) {
      return (
        <Modal
          isVisible={this.state.modalActive}
          onCloseClicked={() => {
            this.props.setReadOnly(false);
            this.setState({modalActive: false});
          }}
          onOverlayClicked={() => {
            this.props.setReadOnly(false);
            this.setState({modalActive: false});
          }}
          title={this.state.modalTitle}
        >
          <ol>
            {this.renderModalChildren(this.state.modalType)}
          </ol>
        </Modal>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className="RichEditor-controls">
        <Tooltip active={this.state.tooltipActive}
                 parentEl={this.state.tooltipParent} position="top" arrow="center">
          {this.state.tooltipText}
        </Tooltip>
        {this.renderModal()}
        {ENTITY_STYLES.map(type =>
          <StyleButton
            key={type.label}
            active={this.currentEntities.has(type.style)}
            label={type.label}
            onToggle={this.toggleEntity}
            inputs={type.inputs}
            style={type.style}
            setReadOnly={this.props.setReadOnly}
            data={{
              text: ""
            }}
          />
        )}
      </div>
    );
  }
}


export default EntityStyleControls;
