import React from 'react';
import StyleButton from './StyleButton';
import DefaultDraftBlockRenderMap from '../immutables/DefaultDraftBlockRenderMap'
import {EditorState, RichUtils } from 'draft-js';

const BLOCK_TYPES = [
  {label: 'H1', style: 'h1'},
  {label: 'H2', style: 'h2'},
  {label: 'H3', style: 'h3'},
  {label: 'H4', style: 'h4'},
  {label: 'H5', style: 'h5'},
  {label: 'H6', style: 'h6'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'Code Block', style: 'pre'},
  {label: 'ul', style: 'ul'},
  {label: 'ol', style: 'ol'},
  {label: 'li', style: 'li'},
  {label: 'table', style: 'table'},
  {label: 'tbody', style: 'tbody'},
  {label: 'tr', style: 'tr'},
  {label: 'td', style: 'td'},
];
const BlockStyleControls = (props) => {
  const {controller} = props;
  function toggleBlockType(type) {
    const toggle = DefaultDraftBlockRenderMap.get(type).toggle
    if(toggle){
      props.onChange(
        EditorState.push(
          props.controller.editorState,
          toggle(props.controller),
          'insert-fragment'
        )
      )
    }else{
      if(props.controller.currentDepth===0){
        props.onChange(RichUtils.toggleBlockType(props.controller.editorState, type));
      }else{
        props.controller.toggleBlockInBlock(type)
        const newContent = props.controller.getCurrentContent()
        props.onChange(
          EditorState.push(props.controller.editorState, newContent, 'insert-fragment'))
      }
    }
  }

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === props.controller.currentType}
          label={type.label}
          onToggle={toggleBlockType}
          style={type.style}
        />
      )}
    </div>
  );
};
export default BlockStyleControls;
