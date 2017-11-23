import React from 'react';
import DimensionHighlighted from "./dimension-highlighted.png";
import DimensionUnhighlighted from "./dimension-unhighlighted.png";


const unhighlighted = {
  background: `url(${DimensionUnhighlighted})`,
  maxWidth: "20em",
  maxHeight: "20em"
};
const highlighted = {
  background: `url(${DimensionHighlighted})`,
  maxWidth: "20em",
  maxHeight: "20em"
};
const wrapper = {
  width: "20em",
  height: "20em",
  overflowY: "hidden"
};

export default class TableSizePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0
    };
  }

  resize = (e) => {
    let x, y;
    const bounds = e.target.getBoundingClientRect();
    x = e.pageX - bounds.left + 5;
    y = e.pageY - bounds.top + 21;
    const sizeX = 1 - x / 18 % 1 + x / 18;
    const sizeY = 1 - y / 18 % 1 + y / 18;
    x = 1 - x / 18 % 1 + x / 16;
    y = 1 - y / 18 % 1 + y / 16;
    this.setState({x, y, sizeX, sizeY});
    this.props.onChange({sizeX, sizeY});
  }

  render() {
    return (
      <div onMouseMove={this.resize} onClick={this.props.onSelect} style={wrapper}>
        <div style={{
          width: "100%",
          height: "100%"
        }}>
          <div style={{
            ...unhighlighted,
            position: "absolute",
            top: 0,
            left: 0,
            width: `15em`,
            height: `15em`
          }}></div>
          <div style={{
            ...highlighted,
            position: "absolute",
            top: 0,
            left: 0,
            width: `${this.state.x}em`,
            height: `${this.state.y}em`
          }}></div>

        </div>
      </div>
    );
  }
}
