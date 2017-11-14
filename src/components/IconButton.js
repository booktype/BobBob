import React from 'react';

import './IconButton.css';


export default class IconButton extends React.PureComponent {
  handleMouseOver = () => {

  }

  render() {
    const {tooltip, style, iconStyle} = this.props;
    return (
      <button style={style} onClick={this.props.onTouchTap} className={'qs'}>
        <div className={'popover'}>
          <span>
            {tooltip}
          </span>
        </div>
        <div style={iconStyle}>
          {this.props.children}
        </div>
      </button>
    );
  }
}
