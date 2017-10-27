import React from 'react';
import {RichUtils} from 'draft-js';
import {GridList, GridTile} from 'material-ui/GridList';
import ArrowDown from '../../../icons/arrowDownDropCircleOutline';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import SelectField from 'material-ui/SelectField';
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

    this.availableStyles = [
      { element: 'h1', label: 'Title'},
      { element: 'h2', label: 'Subtitle' },
      { element: 'h3', label: 'Heading 3' },
      { element: 'h4', label: 'Heading 4' },
      { element: 'h5', label: 'Heading 5' },
      { element: 'h6', label: 'Heading 6' },
      { element: 'blockquote', label: 'Blockquote' },
      { element: 'p', label: 'Unstyled' },
      { element: 'pre', label: 'Preformatted' }
    ]
  }
  shouldComponentUpdate(nextProps){
    if(nextProps.style === this.props.style){
      return true
    }
    return false
  }
  toggleStyle = (style) => {
    this.props.onChange(
      RichUtils.toggleBlockType(
        this.props.controller.editorState,
        style,
      )
    );
  }

  render() {
    return (
      <div style={{display: "inline-block"}}>
        <SelectField
          floatingLabelText="Style"
          value={this.props.style || "p"}
          onChange={(e,i,value)=>this.toggleStyle(value)}
          >
            {this.availableStyles.map(style=>{
              return (
                <MenuItem key={style.element} value={style.element} primaryText={style.label} >
                </MenuItem>
              )
            }
          )}
        </SelectField>
      </div>
    )
  }
}
