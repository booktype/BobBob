import React from 'react';

import './IconButton.css';

export default class IconButton extends React.PureComponent {
  handleMouseOver = () =>{

  }
  render(){
    const {tooltip} = this.props;
    return (
      <button onClick={this.props.onTouchTap} className={'qs'}>
        <div className={'popover'}>
          <span>
            {tooltip}
          </span>
        </div>
        {this.props.children}
      </button>
    )
  }
}
