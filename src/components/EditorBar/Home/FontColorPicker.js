import React from 'react';
import ColorPicker from './ColorPicker/Color';
import IconButton from '../../IconButton';
import FormatColorText from '../../../icons/formatColorText';
import Popover from '../../Popover';
import {RichUtils} from 'draft-js';


export default class FontColorPicker extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.open !== this.state.open) {
      return true;
    }
    if (nextProps.color && nextProps.color === this.props.color) {
      return false;
    }
    return true;
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
    if (this.props.color) {
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          RichUtils.toggleInlineStyle(
            this.props.controller.editorState,
            `color__${this.props.color}`,
          ),
          `color__${color.hex}`,
        )
      );
    } else {
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          this.props.controller.editorState,
          `color__${color.hex}`,
        )
      );
    }

  }
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div style={{display: "inline-block"}}>
        <Popover
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          icon={
            <IconButton
              onTouchTap={this.handleTouchTap}
              tooltip="Font Color"
            >
              <FormatColorText color={this.props.color}/>
            </IconButton>
          }
        >
            <ColorPicker color={{hex: this.props.color}} onChange={this.handleColorChange} disableAlpha={true}/>
        </Popover>
      </div>
    );
  }
}
