import React from 'react'
import IconButton from '../../IconButton';
import TextDirLtoR from '../../../icons/formatTextdirectionLToR';
import TextDirRtoL from '../../../icons/formatTextdirectionRToL';

export default class TextDirection extends React.PureComponent {

  shouldComponentUpdate(nextProps){
    if(nextProps.direction === this.props.direction){
      return false
    }
    return true
  }

  handleDirectionLtoR = () => {
    // this.props.controller.setAttr("dir", "ltr")
    this.props.controller.setStyleAttr("direction", "ltr")
    this.props.controller.setStyleAttr("textAlign", "left")
    this.props.onChange(this.props.controller.editorState)
  };
  handleDirectionRtoL = () => {
    // this.props.controller.setAttr("dir", "rtl")
    this.props.controller.setStyleAttr("direction", "rtl")
    this.props.controller.setStyleAttr("textAlign", "right")
    this.props.onChange(this.props.controller.editorState)
  };


  render() {
    return (
      <div style={{display: "inline-block"}}>
        <IconButton
          onTouchTap={this.handleDirectionLtoR}
          tooltip="Left to Right Text Direction"
          >
            <TextDirLtoR color={!this.props.direction || this.props.direction==="ltr"?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={this.handleDirectionRtoL}
          tooltip="Right to Left Text Direction"
          >
            <TextDirRtoL color={this.props.direction==="rtl"?"orange":"black"}/>
        </IconButton>
      </div>
    )
  }
}
