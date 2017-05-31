import React from 'react'
import IconButton from 'material-ui/IconButton';
import {RichUtils} from 'draft-js';
import IndentIncrease from '../../../icons/formatIndentIncrease';
import IndentDecrease from '../../../icons/formatIndentDecrease';

export default class Indent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      marginLeft: 0
    };
  }
  componentWillReceiveProps(nextProps){
    const style = this.props.controller.currentBlock.getData().get('style')
    let marginLeft;
    if(style){
      marginLeft = style.marginLeft || 0
    }else{
      marginLeft = 0
    }
    if(this.state.marginLeft !== marginLeft){
      this.setState({marginLeft})
    }
  }
  handleIncreaseIndent = () => {
    if(this.state.marginLeft!==864){
      this.props.controller.setStyleAttr("marginLeft", this.state.marginLeft+48)
      this.props.onChange(this.props.controller.editorState)
    }
  };
  handleDecreaseIndent = () => {
    if(this.state.marginLeft!==0){
      this.props.controller.setStyleAttr("marginLeft", this.state.marginLeft-48)
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
