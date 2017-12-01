import React from 'react';
import IconButton from '../../IconButton';
import PageBreakIcon from '../../../icons/pageBreak';


export default class PageBreak extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    // console.log('nextProps.blockType', nextProps.blockType);
    return nextProps.blockType !== this.props.blockType;
  }

  handleTouchTap = (event) => {
    event.preventDefault();
    this._insertPageBreak();
  };

  _insertPageBreak = () => {
    // div block
    this.props.controller.splitBlock().insertElementAfter('page-break');

    const svgPathBlock = this.props.controller.currentBlock;
    let nextBlock = this.props.controller.currentContent.getBlockAfter(svgPathBlock.getKey());
    // if next block is empty -> remove it
    if (nextBlock && nextBlock.getText().length === 0) {
      this.props.controller.removeBlock(nextBlock);
      nextBlock = this.props.controller.currentContent.getBlockAfter(svgPathBlock.getKey());
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
          label={"Insert page break"}
          disabled={this.props.blockType !== 'unstyled'}
        >
          <PageBreakIcon/>
        </IconButton>
      </div>
    );
  }

}