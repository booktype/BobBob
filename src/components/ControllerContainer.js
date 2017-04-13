import React from 'react';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';


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
      {/* <button onClick={onSend}> send </button> */}
    </div>
  }
}

export default ControllerContainer;
