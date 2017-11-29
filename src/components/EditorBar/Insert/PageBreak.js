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
    this.props.controller.splitBlock().insertElementAfter('div')
      .setAttr("contentEditable", "false")
      .setAttr("className", "PageBreakEditor flex items-center justify-center pa0 mv2 dim pointer");
    // svg
    this.props.controller.appendChild('svg')
      .setAttr("contentEditable", "false")
      .setAttr("className", "w1")
      .setAttr("data-icon", "info")
      .setAttr("viewBox", "0 0 24 24");
    // svg path
    this.props.controller.appendChild('path')
      .setAttr("contentEditable", "false")
      .setAttr("d", "M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z");

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