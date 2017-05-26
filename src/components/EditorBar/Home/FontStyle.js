import React from 'react'
import IconButton from 'material-ui/IconButton';
import {RichUtils} from 'draft-js';
import FormatBold from '../../../icons/formatBold'
import FormatItalic from '../../../icons/formatItalic'
import CodeTags from '../../../icons/codeTags'
import Quote from '../../../icons/formatQuoteClose'
import FormatSubscript from '../../../icons/formatSubscript'
import FormatSuperscript from '../../../icons/formatSuperscript'
import FormatStrikethrough from '../../../icons/formatStrikethrough'
import FormatUnderline from '../../../icons/formatUnderline'
const icons = {
  BOLD: FormatBold,
  ITALIC: FormatItalic,
  CODE: CodeTags,
  QUOTATION: Quote,
  SUB: FormatSubscript,
  SUP: FormatSuperscript,
  STRIKETHROUGH: FormatStrikethrough,
  UNDERLINE: FormatUnderline
};
const styles = ["BOLD", "ITALIC", "CODE",
"QUOTATION", "SUB", "SUP", "STRIKETHROUGH", "UNDERLINE"]
const labels = {
  BOLD: "Bold",
  ITALIC: "Italic",
  CODE: "Code",
  QUOTATION: "Quotation",
  SUB: "Subscript",
  SUP: "Superscript",
  STRIKETHROUGH: "Strikethrough",
  UNDERLINE: "Underline"
};
export default class FontStyle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      BOLD: false,
      ITALIC: false,
      CODE: false,
      QUOTATION: false,
      SUB: false,
      SUP: false,
      STRIKETHROUGH: false,
      UNDERLINE: false
    };
  }
  componentWillReceiveProps(nextProps){
    let newState = {}
    for(let type in this.state){
      newState[type] = nextProps.controller.currentInlineStyle.has(type)
    }
    this.setState(newState)
  }
  handleToggleStyle = (style) => {
    // This prevents ghost click.
    event.preventDefault();
    this.props.onChange(
      RichUtils.toggleInlineStyle(
        this.props.controller.editorState,
        style,
      )
    );
  };


  render() {
    return (
      <div style={{display: "inline-block"}}>
        {styles.map(style=>{
          const Icon = icons[style]

          return (
            <IconButton
              key={style}
              onTouchTap={()=>this.handleToggleStyle(style)}
              tooltip={labels[style]}
              >
                <Icon color={this.state[style]?"orange":null}/>
            </IconButton>
          )
          }
        )}
      </div>
    )
  }
}
