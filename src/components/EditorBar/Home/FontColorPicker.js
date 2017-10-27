import React from 'react'
import ColorPicker from './ColorPicker/Color'
import IconButton from 'material-ui/IconButton';
import FormatColorText from '../../../icons/formatColorText'
import Popover from 'material-ui/Popover';
import {RichUtils} from 'draft-js';


export default class FontColorPicker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      color: null
    };
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextState.open!==this.state.open){
      return true
    }
    if(nextProps.color === this.props.color){
      return false
    }
    this.setState({color: this.props.color})
    return true
  }
  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };
  handleColorChange = (color) => {
    if(this.state.color){
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          RichUtils.toggleInlineStyle(
            this.props.controller.editorState,
            `color__${this.state.color}`,
          ),
          `color__${color.hex}`,
        )
      );
    }else{
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          this.props.controller.editorState,
          `color__${color.hex}`,
        )
      );
    }
    this.setState({color: color.hex})

  }
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div style={{display: "inline-block"}}>
        <IconButton
          onTouchTap={this.handleTouchTap}
          tooltip="Font Color"
          >
            <FormatColorText color={this.state.color}/>
          </IconButton>
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            >
              <ColorPicker color={{hex:this.state.color}} onChange={this.handleColorChange} disableAlpha={true}/>
          </Popover>
      </div>
    )
  }
}
