import React from 'react'
import LineSpacing from '../../../icons/formatLineSpacing';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class ParagraphLineSpacing extends React.PureComponent {

  shouldComponentUpdate(nextProps){
    if(nextProps.lineHeight === this.props.lineHeight){
      return false
    }
    return true
  }

  handleChange = (event, index, lineHeight) => {
    this.props.controller.setStyleAttr("lineHeight", lineHeight)
    this.props.onChange(this.props.controller.editorState)
  };


  render() {
    return (
      <div style={{display: "inline-block"}}>

        <DropDownMenu
          iconButton={
            <LineSpacing />
          }
          iconStyle={{fill:"#000000"}}
          value={this.props.lineHeight} onChange={this.handleChange}>
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
