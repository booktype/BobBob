import React from 'react';
import './Popover.css';

export default class Popover extends React.PureComponent {
  componentWillReceiveProps(newProps) {
    if (newProps.open && !this.props.open) {
      document.addEventListener("click", this.props.onRequestClose);
    }
    if (!newProps.open && this.props.open)  {
      document.removeEventListener("click", this.props.onRequestClose);
    }
  }
  render() {
    return (
      <div 
        onClick={(e)=>{
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
         
        className={"popover-container" + (this.props.open ? " show" : "")}>
        {this.props.icon}
        <div className="popover-content">
          <div style={this.props.style || {}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
