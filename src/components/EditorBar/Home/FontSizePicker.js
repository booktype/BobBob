import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RichUtils} from 'draft-js';

const styles = {
  customWidth: {
    width: 80,
  },
};

export default class FontSizePicker extends React.Component {
  constructor(props){
    super(props)
    this.availableSizes = [8,9,10,11,12,14,16,18,20,24,26,28,36,48,72]
    this.state = {
      size: null
    }
  }
  componentWillReceiveProps(nextProps){
    const currentFontSize = nextProps.controller.getStyleType("fontSize")
    if(currentFontSize){
      const size = Number(currentFontSize.split("__")[1])
      if(size!==this.state.size)
        this.setState({
          size
        })
    }else{
        this.setState({
          size: null
        })
    }
  }
  handleSizeChange = (size) => {
    if(this.state.size){
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          RichUtils.toggleInlineStyle(
            this.props.controller.editorState,
            `fontSize__${this.state.size}`,
          ),
          `fontSize__${size}`,
        )
      );
    }else{
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          this.props.controller.editorState,
          `fontSize__${size}`,
        )
      );
    }
    this.setState({size: size})

  }
  render(){
    return (
      <SelectField
        floatingLabelText="Size"
        value={this.state.size ||  11}
        onChange={(e,i,value)=>this.handleSizeChange(value)}
        style={styles.customWidth}
      >
        {this.availableSizes.map(size=>{
          return (
            <MenuItem key={size} value={size} primaryText={`${size}`} />
          )
        }
      )}
      </SelectField>
    )
  }
}
