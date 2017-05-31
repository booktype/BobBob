import React from 'react';
import {RichUtils} from 'draft-js';
import {GridList, GridTile} from 'material-ui/GridList';
import ArrowDown from '../../../icons/arrowDownDropCircleOutline';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
const AbcText = ()=>(
    <span style={{padding: "auto"}}>AaBbCc</span>
)
const ParagraphStyle = (props) => (
  <FlatButton
    fullWidth={true}
    style={{height: "100%"}}
    onTouchTap={props.onToggle}
    >
    <props.element style={{position: "absolute", top: 0, width: "100%"}}>
      <span >AaBbCc</span>
    </props.element>
    <center style={{position: "absolute", bottom: 0, width: "100%"}}>{props.label}</center>
  </FlatButton>
)

export default class ParagraphStyles extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 1,

    };
  }
  toggleStyle = (style) => {
    this.props.onChange(
      RichUtils.toggleBlockType(
        this.props.controller.editorState,
        style,
      )
    );
  }
  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: this.refs.paragraphStyles,
    });
  };
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  render() {
    return (
      <div style={{display: "flex"}}  ref="paragraphStyles">
        <GridList
          style={{width:420}}
          cols={3}
          cellHeight={80}
          ref="paragraphStyles"
        >
          <GridTile
            >
              <ParagraphStyle label="Heading 1" element="h1" onToggle={()=>this.toggleStyle("h1")}/>
            </GridTile>
          <GridTile

            >
              <ParagraphStyle label="Heading 2" element="h2" onToggle={()=>this.toggleStyle("h2")}/>

            </GridTile>
          <GridTile
            >
              <ParagraphStyle label="Heading 3" element="h3" onToggle={()=>this.toggleStyle("h3")}/>

            </GridTile>
          <GridTile
            cols={3}
            rows={0.4}
            >

            <FlatButton
              fullWidth={true}
              label="Styles"
              labelPosition="before"
              primary={true}
              icon={
                <ArrowDown/>
              }
              onTouchTap={this.handleTouchTap}
            />
            </GridTile>
        </GridList>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
          targetOrigin={{horizontal: 'middle', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          style={{overflowY: "inherit"}}
          className={"RichEditor-editor"}
          >
            <GridList
              style={{width:500}}
              cols={3}
              cellHeight={100}
            >
              <GridTile
                >
                  <ParagraphStyle label="Heading 1" element="h1" onToggle={()=>this.toggleStyle("h1")}/>
                </GridTile>
              <GridTile
                >
                  <ParagraphStyle label="Heading 2" element="h2" onToggle={()=>this.toggleStyle("h2")}/>
                </GridTile>
              <GridTile
                >
                  <ParagraphStyle label="Heading 3" element="h3" onToggle={()=>this.toggleStyle("h3")}/>
                </GridTile>
              <GridTile
                >
                  <ParagraphStyle label="Heading 4" element="h4" onToggle={()=>this.toggleStyle("h4")}/>
                </GridTile>
              <GridTile

                >
                  <ParagraphStyle label="Heading 5" element="h5" onToggle={()=>this.toggleStyle("h5")}/>
                </GridTile>
              <GridTile
                >
                  <ParagraphStyle label="Heading 6" element="h6" onToggle={()=>this.toggleStyle("h6")}/>
                </GridTile>
              <GridTile
                >
                  <ParagraphStyle label="Blockquote" element="blockquote" onToggle={()=>this.toggleStyle("blockquote")}/>
                </GridTile>
              <GridTile
                >
                  <ParagraphStyle label="Paragraph" element="p" onToggle={()=>this.toggleStyle("p")}/>

                </GridTile>
              <GridTile
                >
                  <ParagraphStyle label="Preformatted" element="pre" onToggle={()=>this.toggleStyle("pre")}/>
                </GridTile>

            </GridList>
          </Popover>
      </div>
    )
  }
}
