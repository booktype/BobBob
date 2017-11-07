import React from 'react'
import IconButton from '../../IconButton';
import IndentIncrease from '../../../icons/formatIndentIncrease';
import IndentDecrease from '../../../icons/formatIndentDecrease';

export default class Indent extends React.PureComponent {

  shouldComponentUpdate(nextProps){
    if(nextProps.marginLeft === this.props.marginLeft){
      return false
    }
    return true
  }
  handleIncreaseIndent = () => {
    const marginLeft = this.props.marginLeft || 0
    if(marginLeft!==864){
      this.props.controller.setStyleAttr("marginLeft", marginLeft+48)
      this.props.onChange(this.props.controller.editorState)
    }
  };
  handleDecreaseIndent = () => {
    const marginLeft = this.props.marginLeft || 0
    if(marginLeft!==0){
      this.props.controller.setStyleAttr("marginLeft", marginLeft-48)
      this.props.onChange(this.props.controller.editorState)
    }
  };


  render() {
    return (
      <div style={{display: "inline-block"}}>
        <IconButton
          onTouchTap={this.handleIncreaseIndent}
          tooltip="Increase Indent"
          >
            <IndentIncrease />
        </IconButton>
        <IconButton
          onTouchTap={this.handleDecreaseIndent}
          tooltip="Decrease Indent"
          >
            <IndentDecrease />
        </IconButton>
      </div>
    )
  }
}
