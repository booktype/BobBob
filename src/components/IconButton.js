import React from 'react';

import './IconButton.css';


export default class IconButton extends React.PureComponent {

  render() {
    const {tooltip, style, iconStyle} = this.props;
    let buttonClasses = [
      'icon-button', 'qs', 'f6', 'link', 'dim', 'br1', 'ba', 'ph1', 'pv1', 'mb1', 'dib',
      this.props.disabled ? 'bg-moon-gray' : 'bg-white',
      'black'
    ];
    return (
      <button
        style={style}
        disabled={this.props.disabled}
        onClick={this.props.onTouchTap}
        className={buttonClasses.join(' ')}>
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
