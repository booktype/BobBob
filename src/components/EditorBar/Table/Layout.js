import React from 'react';
import {Tab} from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import TableEdit from '../../../icons/tableEdit';
import TableIcon from '../../../icons/table';
import TableColumnRemove from '../../../icons/tableColumnRemove';
import TableRowRemove from '../../../icons/tableRowRemove';
import TableRowPlusBefore from '../../../icons/tableRowPlusBefore';
import TableRowPlusAfter from '../../../icons/tableRowPlusAfter';
import TableColumnPlusBefore from '../../../icons/tableColumnPlusBefore';
import TableColumnPlusAfter from '../../../icons/tableColumnPlusAfter';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
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
    "width": "130%",
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

export default class TableLayout extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  componentWillReceiveProps(nextProps){

  }
  addAltText = (alttext)=>{

  }
  deleteTable = ()=>{
    this.props.onChange(
      this.props.controller
      .queryParent("table")
      .removeElement().editorState)
  }
  deleteRow = () => {
    this.props.onChange(
      this.props.controller
      .queryParent("tr")
      .removeElement().editorState)
  }
  deleteColumn = () => {
    let at_index = this.props.controller.getChildIndex()
    console.log(at_index)
    this.props.onChange(this.props.controller.queryParent("tbody")
    .queryAndRemove("tr","td", at_index).editorState)
  }
  insertRowAbove = () => {
    const columns = this.props.controller.queryParent("tr")
    .countChildren()
    this.props.onChange(this.props.controller.insertElementBefore("tr")
    .appendChildren("td", columns)
    .editorState)

  }
  insertRowBelow = () => {
    const columns = this.props.controller.queryParent("tr")
    .countChildren()
    this.props.onChange(this.props.controller.insertElementAfter("tr")
    .appendChildren("td", columns)
    .editorState)

  }
  insertColumnLeft = () => {
    let at_index = this.props.controller.getChildIndex()
    if(at_index){
      at_index = at_index -1
    }
    console.log(at_index)
    this.props.onChange(this.props.controller.queryParent("tbody")
    .queryAndAppend("tr","td", at_index).editorState)
  }
  insertColumnRight = () => {
    const at_index = this.props.controller.getChildIndex()
    console.log(at_index)
    this.props.onChange(this.props.controller.queryParent("tbody")
    .queryAndAppend("tr","td", at_index).editorState)

  }
  alignCell = (position) => {

  }
  render(){
    return (
        <Toolbar style={{height: 130}}>
          {/* <InlineStyleControls controller={this.props.controller} onChange={this.onChange}/> */}
          <ToolbarGroup firstChild={true}>
            <div style={styles.ribbon_row}>
              <IconButton tooltip={"Insert Alternative Text"} iconStyle={{width: 48, height: 48}}>
                <TableEdit />
              </IconButton>
              <div>Alt-Text</div>
            </div>
            <ToolbarTitle text="Table" style={styles.ribbon_group_title} />
          </ToolbarGroup>
          <ToolbarGroup firstChild={true}>
            <div >
              <IconButton tooltip={"Delete Table"}
                onTouchTap={this.deleteTable}
                style={{width: 60, height: 60}}
                iconStyle={{width: 48, height: 48}}>
                <TableIcon color={"red"}/>
              </IconButton>
              <IconButton tooltip={"Delete Column"}
                onTouchTap={this.deleteColumn}
                style={{width: 60, height: 60}}
                iconStyle={{width: 48, height: 48}}>
                <TableColumnRemove />
              </IconButton>
              <IconButton tooltip={"Delete Row"}
                onTouchTap={this.deleteRow}
                style={{width: 60, height: 60}}
                iconStyle={{width: 48, height: 48}}>
                <TableRowRemove />
              </IconButton>
            </div>
            <ToolbarTitle text="Delete" style={styles.ribbon_group_title} />
          </ToolbarGroup>
          <ToolbarGroup firstChild={true}>
            <div style={styles.ribbon_row}>
              <IconButton tooltip={"Insert Row Above"}
                onTouchTap={this.insertRowAbove}
                style={{width: 60, height: 60}}
                iconStyle={{width: 48, height: 48}}>
                <TableRowPlusBefore />
              </IconButton>
              <IconButton tooltip={"Insert Row Below"}
                onTouchTap={this.insertRowBelow}

                style={{width: 60, height: 60}}
                iconStyle={{width: 48, height: 48}}>
                <TableRowPlusAfter />
              </IconButton>
              <IconButton tooltip={"Insert Column Left"}
                onTouchTap={this.insertColumnLeft}

                style={{width: 60, height: 60}}
                iconStyle={{width: 48, height: 48}}>
                <TableColumnPlusBefore />
              </IconButton>
              <IconButton tooltip={"Insert Column Right"}
                onTouchTap={this.insertColumnRight}

                style={{width: 60, height: 60}}
                iconStyle={{width: 48, height: 48}}>
                <TableColumnPlusAfter />
              </IconButton>

            </div>
            <ToolbarTitle text="Insert" style={styles.ribbon_group_title} />
          </ToolbarGroup>
          <ToolbarGroup firstChild={true}>
            <div style={styles.ribbon_row}>
            </div>
            <ToolbarTitle text="Alignment" style={styles.ribbon_group_title} />
          </ToolbarGroup>
        </Toolbar>
    )
  }
}
