import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import EntityStyleControls from './EntityStyleControls';
import SideContent from './SideContent'
import BlockTree from './BlockTree'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FontColorPicker from './EditorBar/Home/FontColorPicker'
import HighlightColorPicker from './EditorBar/Home/HighlightColorPicker'
import FontSizePicker from './EditorBar/Home/FontSizePicker'
import FontPicker from './EditorBar/Home/FontPicker'
import FontStyle from './EditorBar/Home/FontStyle'
import UnorderedList from './EditorBar/Home/UnorderedList'
import OrderedList from './EditorBar/Home/OrderedList'
import Indent from './EditorBar/Home/Indent'
import ParagraphAlign from './EditorBar/Home/ParagraphAlign'
import TextDirection from './EditorBar/Home/TextDirection'
import LineSpacing from './EditorBar/Home/ParagraphLineSpacing'
import ParagraphStyles from './EditorBar/Home/ParagraphStyles'
const styles = {
  controller: {
    position: "fixed",
    backgroundColor: "white",
    width: 1350,
    zIndex: 1000
  },
  "ribbon_toolbar":{
    "display": "flex",
    "WebkitFlexDirection": "row",
    "flexDirection": "row",
  },
  "ribbon_group": {
    "position": "relative",
    "height": "92px",
    "float": "left",
    "borderStyle": "solid",
    "borderWidth": "1px",
    "borderColor": "transparent",
    "padding": "20px",
    "MozBoxSizing": "content-box",
    "WebkitBoxSizing": "content-box",
    "boxSizing": "content-box"
  },
  ribbon_row: {
    "display": "flex",
    "WebkitFlexDirection": "row",
    "flexDirection": "row"
  },
  "ribbon_group_title": {
    "position": "absolute",
    // "left": "50",
    "bottom": "0",
    // "textAlign": "center",
    "width": "100%",
    "lineHeight": "15px",
  },
  "ribbon_toolbar": {
    "position": "flex",
    "float": "left"
  },
  "ribbon_group__l_btn": {
    "float": "left"
  },
  "ribbon_group_sep": {
    "float": "left",
    "width": "0",
    "height": "102px",
    "fontSize": "0",
    "margin": "0 2px",
    "borderLeft": "1px solid #ccc",
    "borderRight": "1px solid #fff"
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
          <Tab label="Home">
            <Toolbar style={{height: 130}}>
              {/* <InlineStyleControls controller={this.props.controller} onChange={this.onChange}/> */}
              <ToolbarGroup firstChild={true}
                // style={styles.ribbon_group}
                >
                <div style={styles.ribbon_row}>
                  <FontPicker controller={this.props.controller} onChange={this.onChange}/>
                  <FontSizePicker controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <div>
                  <FontColorPicker controller={this.props.controller} onChange={this.onChange}/>
                  <HighlightColorPicker controller={this.props.controller} onChange={this.onChange}/>
                </div>

                <div style={styles.ribbon_toolbar}>
                  <FontStyle controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <ToolbarTitle text="Font" style={styles.ribbon_group_title} />
              </ToolbarGroup>

              <ToolbarGroup firstChild={true} >
                <div style={{display:"flex"}}>
                  <ParagraphAlign controller={this.props.controller} onChange={this.onChange}/>
                  <Indent controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <div style={{display:"inline"}}>
                  <UnorderedList controller={this.props.controller} onChange={this.onChange}/>
                  <OrderedList controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <div style={{display:"flex"}}>
                  <LineSpacing controller={this.props.controller} onChange={this.onChange}/>
                  <TextDirection controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <ToolbarTitle text="Paragraph" style={styles.ribbon_group_title} />

              </ToolbarGroup>
              <ToolbarGroup firstChild={true} style={styles.ribbon_group}>
                <ParagraphStyles controller={this.props.controller} onChange={this.onChange}/>
              </ToolbarGroup>
            </Toolbar>
          </Tab>
          <Tab label="Insert">
            <BlockStyleControls controller={this.props.controller} onChange={this.onChange}/>
          </Tab>
          <Tab label="Review">
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
