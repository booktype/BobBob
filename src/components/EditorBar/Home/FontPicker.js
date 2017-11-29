import React from 'react';
import SelectField, {Option} from '../../SelectField';
import {RichUtils} from 'draft-js';


export default class FontSizePicker extends React.PureComponent {
  constructor(props) {
    super(props);
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
    ];
    this.state = {
      fontFamily: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.fontFamily === this.props.fontFamily) {
      return false;
    }
    return true;
  }

  handleFontChange = (fontFamily) => {
    if (this.state.fontFamily) {
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          RichUtils.toggleInlineStyle(
            this.props.controller.editorState,
            `fontFamily__${this.state.fontFamily}`,
          ),
          `fontFamily__${fontFamily}`,
        )
      );
    } else {
      this.props.onChange(
        RichUtils.toggleInlineStyle(
          this.props.controller.editorState,
          `fontFamily__${fontFamily}`,
        )
      );
    }
  }

  render() {
    return (
      <SelectField
        label="Font"
        value={this.props.fontFamily || "sans-serif"}
        onChange={(value) => this.handleFontChange(value)}
        style={{width: 150, fontFamily: this.props.fontFamily || "sans-serif"}}
        hint="Font family"
      >
        {this.availableFonts.map(fontFamily => {
          return (
            <Option 
              key={fontFamily} 
              style={{fontFamily}} 
              value={fontFamily} 
              label={fontFamily} 
            />
          );
        }
      )}
      </SelectField>
    );
  }
}
