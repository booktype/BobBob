import React from 'react';
import 'Dropdown.css';


let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      menuActive: false
    };
  }

  toggleMenu() {
    let menuState = !this.state.menuActive;
    this.setState({
      menuActive: menuState
    });
  }

  render() {
    let menu;
    if (this.state.menuActive) {
      menu = <div>
        <ul>
          <li>First Item</li>
          <li>Second Item</li>
          <li>Third Item</li>
        </ul>
      </div>;
    } else {
      menu = "";
    }
    return (
      <div id="menu">
        <i className="fa fa-plus" onClick={this.toggleMenu}/>
        {menu}
      </div>
    );
  }
}


export default DropDown;
