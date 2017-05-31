import React from 'react'
import IconButton from 'material-ui/IconButton';
import {Modifier} from 'draft-js';
import AlignLeft from '../../../icons/formatAlignLeft';
import AlignCenter from '../../../icons/formatAlignCenter';
import AlignRight from '../../../icons/formatAlignRight';
import AlignJustify from '../../../icons/formatAlignJustify';

export default class ParagraphAlign extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      textAlign: "left"
    };
  }
  componentWillReceiveProps(nextProps){
    const style = this.props.controller.currentBlock.getData().get('style')
    let textAlign;
    if(style){
      textAlign = style.textAlign || "left"
    }else{
      textAlign = "left"
    }
    if(textAlign!==this.state.textAlign)
    this.setState({
      textAlign
    })
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
            <AlignLeft color={this.state.textAlign=="left"?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={()=>this.handleToggleStyle("center")}
          tooltip="Align Text Center"
          >
            <AlignCenter color={this.state.textAlign=="center"?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={()=>this.handleToggleStyle("right")}
          tooltip="Align Text Right"
          >
            <AlignRight color={this.state.textAlign=="right"?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={()=>this.handleToggleStyle("justify")}
          tooltip="Justify"
          >
            <AlignJustify color={this.state.textAlign=="justify"?"orange":"black"}/>
        </IconButton>
      </div>
    )
  }
}
