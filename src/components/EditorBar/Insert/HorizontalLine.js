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
    this.props.controller.splitBlock()
    .insertElementAfter('hr')
    // if next block is empty -> remove it
    if (!this.props.controller.nextBlock.getText()) {
      this.props.controller.removeBlock(this.props.controller.nextBlock);
    }
    
    // put cursor on the next block
    this.props.controller.selectNextBlock();

    this.props.onChange(this.props.controller.editorState);
  };

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <IconButton
          onTouchTap={this.handleTouchTap}
          label={"Insert horizontal line"}
          // disabled={this.props.blockType !== 'unstyled'}
        >
          <HorizontalLineIcon/>
        </IconButton>
      </div>
    );
  }

}