import React from 'react';
import StyleButton from './StyleButton'
import {RichUtils} from 'draft-js';
var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
  {label: 'Blue', style: 'color__blue'}
];

const InlineStyleControls = (props) => {
  var currentStyle = props.controller.currentInlineStyle;
  function toggleInlineStyle(inlineStyle) {
    props.onChange(
      RichUtils.toggleInlineStyle(
        props.controller.editorState,
        inlineStyle
      )
    );
  }
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={toggleInlineStyle}
          style={type.style}
        />
      )}
    </div>
  );
};

export default InlineStyleControls
