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
const styles = ["BOLD", "ITALIC", "STRIKETHROUGH", "UNDERLINE", "CODE",
"QUOTATION", "SUB", "SUP"]
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
export default class FontStyle extends React.PureComponent {

  handleToggleStyle = (style) => {
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
                <Icon color={this.props.styles[style]?"orange":null}/>
            </IconButton>
          )
          }
        )}
      </div>
    )
  }
}
