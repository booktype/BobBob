import React from 'react'
import IconButton from 'material-ui/IconButton';
import AlignLeft from '../../../icons/formatAlignLeft';
import AlignCenter from '../../../icons/formatAlignCenter';
import AlignRight from '../../../icons/formatAlignRight';
import AlignJustify from '../../../icons/formatAlignJustify';

export default class ParagraphAlign extends React.PureComponent {

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.textAlign === this.props.textAlign){
      return false
    }
    return true
  }
  handleToggleStyle = (align) => {
    this.props.controller.setStyleAttr("textAlign", align)
    this.props.onChange(this.props.controller.editorState)
  };
  render() {
    return (
      <div style={{display: "inline-block"}}>
        <IconButton
          onTouchTap={()=>this.handleToggleStyle("left")}
          tooltip="Align Text Left"
          >
            <AlignLeft color={this.props.textAlign === "left" || !this.props.textAlign?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={()=>this.handleToggleStyle("center")}
          tooltip="Align Text Center"
          >
            <AlignCenter color={this.props.textAlign==="center"?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={()=>this.handleToggleStyle("right")}
          tooltip="Align Text Right"
          >
            <AlignRight color={this.props.textAlign==="right"?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={()=>this.handleToggleStyle("justify")}
          tooltip="Justify"
          >
            <AlignJustify color={this.props.textAlign==="justify"?"orange":"black"}/>
        </IconButton>
      </div>
    )
  }
}
