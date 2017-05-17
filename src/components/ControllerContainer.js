import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import EntityStyleControls from './EntityStyleControls';
import SideContent from './SideContent'
import BlockTree from './BlockTree'
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
      <div style={styles.controller}>
        <Tabs>
          <Tab label="Inline">
            <InlineStyleControls controller={this.props.controller} onChange={this.onChange}/>
          </Tab>
          <Tab label="Block">
            <BlockStyleControls controller={this.props.controller} onChange={this.onChange}/>
          </Tab>
          <Tab label="Entity">
            <EntityStyleControls controller={this.props.controller} onChange={this.onChange}
              setReadOnly={this.props.setReadOnly}
              hoverTarget={this.props.hoverTarget}
              clickTarget={this.props.clickTarget}/>

          </Tab>
        </Tabs>
        <BlockTree controller={this.props.controller} onChange={this.onChange}/>
        <SideContent query={"comment"} controller={this.props.controller} onChange={this.onChange}/>
      </div>
    )
  }
}

export default ControllerContainer;
