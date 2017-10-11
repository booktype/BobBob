import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar';
import EntityStyleControls from './EntityStyleControls';
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
import TablePicker from './EditorBar/Insert/Table'
import LinkForm from './EditorBar/Insert/Link'
import PictureForm from './EditorBar/Insert/Picture'
import CommentButton from './EditorBar/Insert/Comment'
import TableTab from './EditorBar/Table/Layout'


const styles = {
  controller: {
    backgroundColor: "white",
    marginLeft: 0,
    width: "100%",
    zIndex: 1000
  },
  "ribbon_toolbar": {
    "position": "flex",
    "float": "left"
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
    "width": "130%",
    "lineHeight": "15px",
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
};


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
              <ToolbarGroup firstChild={true}>
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
                <ToolbarTitle text="Font" style={styles.ribbon_group_title}/>
              </ToolbarGroup>

              <ToolbarGroup firstChild={true}>
                <div style={{display: "flex"}}>
                  <ParagraphAlign controller={this.props.controller} onChange={this.onChange}/>
                  <Indent controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <div style={{display: "inline"}}>
                  <UnorderedList controller={this.props.controller} onChange={this.onChange}/>
                  <OrderedList controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <div style={{display: "flex"}}>
                  <LineSpacing controller={this.props.controller} onChange={this.onChange}/>
                  <TextDirection controller={this.props.controller} onChange={this.onChange}/>
                </div>
                <ToolbarTitle text="Paragraph" style={styles.ribbon_group_title}/>

              </ToolbarGroup>
              <ToolbarGroup firstChild={true} style={styles.ribbon_group}>
                <ParagraphStyles controller={this.props.controller} onChange={this.onChange}/>
              </ToolbarGroup>
            </Toolbar>
          </Tab>
          <Tab label="Insert">
            <Toolbar style={{height: 130}}>
              <ToolbarGroup firstChild={true}>
                <div>
                  <TablePicker controller={this.props.controller} onChange={this.onChange}/>

                </div>

                <ToolbarTitle text="Table" style={styles.ribbon_group_title}/>
              </ToolbarGroup>
              <ToolbarGroup>
                <div>
                  <LinkForm controller={this.props.controller} onChange={this.onChange}/>
                </div>

                <ToolbarTitle text="Link" style={styles.ribbon_group_title}/>
              </ToolbarGroup>
              <ToolbarGroup style={{width: 100}}>
                <div>
                  <PictureForm controller={this.props.controller} onChange={this.onChange}/>
                </div>

                <ToolbarTitle text="Picture" style={styles.ribbon_group_title}/>
              </ToolbarGroup>
              <ToolbarGroup style={{width: 100}}>
                <div>
                  <CommentButton controller={this.props.controller} onChange={this.onChange}/>
                </div>

                <ToolbarTitle text="Comment" style={styles.ribbon_group_title}/>
              </ToolbarGroup>
              <ToolbarGroup style={{width: 500}}>
              </ToolbarGroup>


            </Toolbar>
          </Tab>
          <Tab label="Review">
            <EntityStyleControls controller={this.props.controller} onChange={this.onChange}
                                 setReadOnly={this.props.setReadOnly}
                                 hoverTarget={this.props.hoverTarget}
                                 clickTarget={this.props.clickTarget}/>

          </Tab>
          {this.props.controller.location.find(block => block.getType() === "table") ?
            <Tab label="Table Layout">
              <TableTab controller={this.props.controller} onChange={this.onChange}/>
            </Tab>
            : null}
        </Tabs>
      </div>
    )
  }
}


export default ControllerContainer;
