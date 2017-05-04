import React from 'react';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import EntityStyleControls from './EntityStyleControls';
import SideContent from './SideContent'
const styles = {
  controller: {
    position: "fixed",
    backgroundColor: "white",
    zIndex: 1000
  }
}



class ControllerContainer extends React.Component {
  constructor(props) {
    super(props)
  }
  onChange = (editorState) => {
    this.props.onChange(editorState)
  }
  render() {
    return (
      <div>
        <div style={styles.controller}>
          <BlockStyleControls controller={this.props.controller} onChange={this.onChange}/>
          <InlineStyleControls controller={this.props.controller} onChange={this.onChange}/>
          <EntityStyleControls controller={this.props.controller} onChange={this.onChange} setReadOnly={this.props.setReadOnly} hoverTarget={this.props.hoverTarget} clickTarget={this.props.clickTarget}/>
        </div>
        <SideContent query={"comment"}/>
      </div>
    )
  }
}

export default ControllerContainer;
