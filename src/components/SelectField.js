import React from 'react';
import './SelectField.css';

export default class SelectField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listVisible: false,
      display: "",
      selected: {
        label: '',
        value: 'none',
        style: {}
      }
    };
  }
  componentWillReceiveProps(newProps) {
    if (!newProps.value) {
      if (this.state.selected.label) {
        this.setState({
          selected: {
            label: ''
          }
        });
      }
    } else if (newProps.value !== this.state.selected.value) {
      const selected = this.props.children.find((item) => {
        return item.props.value === newProps.value;
      });
      if (!selected) {
        this.setState({
          selected: {
            label: ''
          }
        });
      } else {
        this.setState({ selected: selected.props })
      }
    }
  }

  select = (item) => {
    this.setState({ selected: item });
    this.props.onChange(item.value);
  }
  show = () => {
    this.setState({ listVisible: true });
    document.addEventListener("click", this.hide);
  }
  hide = () => {
    this.setState({ listVisible: false });
    document.removeEventListener("click", this.hide);
  }
  render() {
    return (
      <div style={this.props.style || {}} className={"dropdown-container" + (this.state.listVisible ? " show" : "")}>
        <div
          className={"dropdown-display" + (this.state.listVisible ? " clicked" : "")}
          onClick={this.show}
        >
          <span>
            <span>
              {this.props.icon}
            </span>

            {
              this.state.selected.label ||
              <span style={{ color: 'grey' }}>
                {this.props.hint}
              </span>}
          </span>
        </div>
        <div className="dropdown-list">
          <div>
            {this.renderListItems()}
          </div>
        </div>
      </div>
    );
  }
  renderListItems = () => {
    let children;
    if (!this.props.children.length) {
      children = [this.props.children];
    } else {
      children = this.props.children;
    }
    return children.map((item, idx) => {
      return (
        <div
          key={idx}
          onClick={this.select.bind(null, item.props)}
        >
          {item}
        </div>
      );
    });
  }
}

export function Option(props) {
  const style = props.style || {};
  if (props.image) {
    style.backgroundImage = `url(${props.image})`;
  }
  return (
    <span className={props.className} style={style}>
      {props.children || props.label}
    </span>
  );
}
