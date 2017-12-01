import React from 'react';
import TablePicker from './TablePicker';
import IconButton from '../../IconButton';
import Popover from '../../Popover';
import TableIcon from '../../../icons/table';


export default class TableButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      sizeX: 0,
      sizeY: 0
    };
  }

  handleTouchTap = (event) => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  handleSizeChange = (size) => {
    this.setState({...size});
  }
  handleChosenSize = () => {
    this.handleRequestClose();
    this.props.controller
      .insertElementAfter("div")
      .setAttr("className", "group_table")
      .appendChild("table")
      .appendChild("tbody");
    for (let x = 0; x < this.state.sizeX; x++) {
      this.props.controller.appendChild("tr")
        .appendChildren("td", this.state.sizeY).queryParent("tbody");
    }
    this.props.onChange(this.props.controller.editorState);
    this.setState({sizeX: 0, sizeY: 0});
  }

  render() {
    return (
      <div style={{display: 'inline-block'}}>

        <Popover
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          style={{width: '15em', height: '15em'}}
          icon={
            <IconButton
              onTouchTap={this.handleTouchTap}
              label={"Insert table"}
            >
              <TableIcon/>
            </IconButton>
          }
        >
          <strong
            style={{
              position: 'absolute',
              zIndex: 5,
              top: `${this.state.sizeY}em`,
              left: `${this.state.sizeX}em`,
            }}
            >{`${this.state.sizeX} X ${this.state.sizeY}`}</strong>
          <TablePicker onChange={this.handleSizeChange} onSelect={this.handleChosenSize}/>
          </Popover>
      </div>
    );
  }
}
