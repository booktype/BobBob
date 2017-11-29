import React from 'react';
import IconButton from '../../IconButton';
import HorizontalLineIcon from '../../../icons/horizontalLine';


export default class HorizontalLine extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    return nextProps.blockType !== this.props.blockType;
  }

  handleTouchTap = (event) => {
    event.preventDefault();
    this._insertHorizontalLine();
  };

  _insertHorizontalLine = () => {
    this.props.controller.splitBlock().insertElementAfter('hr');

    let nextBlock = this.props.controller.currentContent.getBlockAfter(
      this.props.controller.currentBlock.getKey()
    );
    // if next block is empty -> remove it
    if (nextBlock && nextBlock.getText().length === 0) {
      this.props.controller.removeBlock(nextBlock);
      nextBlock = this.props.controller.currentContent.getBlockAfter(
        this.props.controller.currentBlock.getKey()
      );
    }

    // put cursor on the next block
    this.props.controller.setCursorOnBlock(nextBlock);

    this.props.onChange(this.props.controller.editorState);
  };

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <IconButton
          onTouchTap={this.handleTouchTap}
          label={"Insert horizontal line"}
          disabled={this.props.blockType !== 'unstyled'}
        >
          <HorizontalLineIcon/>
        </IconButton>
      </div>
    );
  }

}