import React from 'react';
import IconButton from '../../IconButton';
import HorizontalLineIcon from '../../../icons/horizontalLine';


export default class HorizontalLine extends React.PureComponent {
  handleTouchTap = (event) => {
    event.preventDefault();
    this._insertHorizontalLine();
  };

  _insertHorizontalLine = () => {
    this.props.controller.insertElementAfter('hr');
    this.props.onChange(this.props.controller.editorState);
  };

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <IconButton
          onTouchTap={this.handleTouchTap}
          label={"Insert horizontal line"}
        >
          <HorizontalLineIcon/>
        </IconButton>
      </div>
    );
  }

}