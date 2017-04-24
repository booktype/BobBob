import React from 'react';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import EntityStyleControls from './EntityStyleControls';

class ControllerContainer extends React.Component {
  constructor(props){
    super(props)
  }
  onChange = (editorState) => {
    this.props.onChange(editorState)
  }
  render(){
    return <div>
      <BlockStyleControls
        controller={this.props.controller}
        onChange={this.onChange}
      />
      <InlineStyleControls
        controller={this.props.controller}
        onChange={this.onChange}
      />
      <EntityStyleControls
        controller={this.props.controller}
        onChange={this.onChange}
        setReadOnly={this.props.setReadOnly}
        hoverTarget={this.props.hoverTarget}
        clickTarget={this.props.clickTarget}
      />
      {/* <button onClick={onSend}> send </button> */}
    </div>
  }
}

export default ControllerContainer;
