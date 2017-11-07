import React from 'react'
import ColorPicker from './ColorPicker/Color'
import IconButton from '../../IconButton';
import FormatColorFill from '../../../icons/formatColorFill'
import Popover from 'material-ui/Popover';
import {RichUtils} from 'draft-js';


export default class HighlightColorPicker extends React.PureComponent {

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
    if(nextProps.backgroundColor === this.props.backgroundColor){
      return false
    }
    this.setState({backgroundColor: this.props.backgroundColor})
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
    if(this.props.backgroundColor){
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          RichUtils.toggleInlineStyle(
            this.props.controller.editorState,
            `backgroundColor__${this.props.backgroundColor}`,
          ),
          `backgroundColor__${color.hex}`,
        )
      );
    }else{
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          this.props.controller.editorState,
          `backgroundColor__${color.hex}`,
        )
      );
    }
    this.setState({backgroundColor: color.hex})

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
          tooltip="Highlight Color"
          >
            <FormatColorFill color={this.state.backgroundColor}/>
          </IconButton>
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            >
              <ColorPicker color={{hex: this.state.backgroundColor}} onChange={this.handleColorChange} disableAlpha={true}/>
          </Popover>
      </div>
    )
  }
}
