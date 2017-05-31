import React from 'react'
import IconButton from 'material-ui/IconButton';
import {RichUtils} from 'draft-js';
import TextDirLtoR from '../../../icons/formatTextdirectionLToR';
import TextDirRtoL from '../../../icons/formatTextdirectionRToL';

export default class TextDirection extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      direction: "ltr"
    };
  }
  componentWillReceiveProps(nextProps){
    const attributes = this.props.controller.currentBlock.getData().get('attributes')
    let direction;
    if(attributes){
      direction = attributes.dir || "ltr"
    }else{
      direction = "ltr"
    }
    if(this.state.direction !== direction){
      this.setState({direction})
    }
  }
  handleDirectionLtoR = () => {
    this.props.controller.setAttr("dir", "ltr")
    this.props.onChange(this.props.controller.editorState)
  };
  handleDirectionRtoL = () => {
    this.props.controller.setAttr("dir", "rtl")
    this.props.onChange(this.props.controller.editorState)
  };


  render() {
    return (
      <div style={{display: "inline-block"}}>
        <IconButton
          onTouchTap={this.handleDirectionLtoR}
          tooltip="Left to Right Text Direction"
          >
            <TextDirLtoR color={this.state.direction==="ltr"?"orange":"black"}/>
        </IconButton>
        <IconButton
          onTouchTap={this.handleDirectionRtoL}
          tooltip="Right to Left Text Direction"
          >
            <TextDirRtoL color={this.state.direction==="rtl"?"orange":"black"}/>
        </IconButton>
      </div>
    )
  }
}
