import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RichUtils} from 'draft-js';

const styles = {
  customWidth: {
    width: 200,
  },
};

export default class FontSizePicker extends React.Component {
  constructor(props){
    super(props)
    this.availableFonts = [
      "sans-serif",
      "serif",
      "monospace",
      "roboto",
      "roboto-condensed",
      "roboto-light",
      "texgyrecursor",
      "texgyreadventor",
      "texgyrepagella",
      "texgyreschola",
      "ubuntu",
      "ubuntu-mono",
      "ubuntu-light",
      "freemono",
      "dejavusans",
      "im_fell_dw_pica_pro",
    ]
    this.state = {
      font: null
    }
  }
  componentWillReceiveProps(nextProps){
    const currentFont = nextProps.controller.getStyleType("fontFamily")
    if(currentFont){
      const font = currentFont.split("__")[1]
      if(font!==this.state.font)
        this.setState({
          font
        })
    }else{
        this.setState({
          font: null
        })
    }
  }
  handleFontChange = (font) => {
    if(this.state.font){
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          RichUtils.toggleInlineStyle(
            this.props.controller.editorState,
            `fontFamily__${this.state.font}`,
          ),
          `fontFamily__${font}`,
        )
      );
    }else{
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          this.props.controller.editorState,
          `fontFamily__${font}`,
        )
      );
    }
    this.setState({font})

  }
  render(){
    return (
      <SelectField
        floatingLabelText="Font"
        value={this.state.font || "sans-serif"}
        onChange={(e,i,value)=>this.handleFontChange(value)}
        style={{width: 200, fontFamily: this.state.font || "sans-serif"}}
      >
        {this.availableFonts.map(font=>{
          return (
            <MenuItem key={font} style={{fontFamily: font}} value={font} primaryText={font} />
          )
        }
      )}
      </SelectField>
    )
  }
}
