import React from 'react'
import IconButton from 'material-ui/IconButton';
import {RichUtils} from 'draft-js';
import LineSpacing from '../../../icons/formatLineSpacing';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class ParagraphLineSpacing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: 1};
  }

  componentWillReceiveProps(nextProps){
    const style = this.props.controller.currentBlock.getData().get('style')
    let lineHeight;
    if(style){
      lineHeight = style.lineHeight || 1
    }else{
      lineHeight = 1
    }
    if(lineHeight!==this.state.lineHeight)
    this.setState({
      lineHeight
    })
  }

  handleChange = (event, index, lineHeight) => {
    this.props.controller.setStyleAttr("lineHeight", lineHeight)
    this.props.onChange(this.props.controller.editorState)
    this.setState({lineHeight})
  };


  render() {
    return (
      <div style={{display: "flex"}}>

        <DropDownMenu
          iconButton={
            <LineSpacing />
          }
          iconStyle={{fill:"#000000"}}
          value={this.state.lineHeight} onChange={this.handleChange}>
          <MenuItem value={1} primaryText="1" />
          <MenuItem value={1.15} primaryText="1,15" />
          <MenuItem value={1.5} primaryText="1,5" />
          <MenuItem value={2} primaryText="2" />
          <MenuItem value={2.5} primaryText="2,5" />
          <MenuItem value={3} primaryText="3" />
        </DropDownMenu>

      </div>
    )
  }
}
