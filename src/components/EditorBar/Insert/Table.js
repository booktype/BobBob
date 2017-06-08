import React from 'react';
import TablePicker from './TablePicker';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import TableIcon from '../../../icons/table';
import Badge from 'material-ui/Badge';
export default class TableButton extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      open: false,
      sizeX: 0,
      sizeY: 0
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  handleSizeChange = (size) => {
    console.log(size)
    this.setState({...size})
  }
  handleChosenSize = () => {
    this.handleRequestClose()
    this.props.controller
      .insertElementAfter("div")
      .setAttr("className", "group_table")
      .appendChild("table")
      .appendChild("tbody")
    for(let x = 0; x<this.state.sizeX;x++){
      this.props.controller.appendChild("tr")
      .appendChildren("td", this.state.sizeY).queryParent("tbody")
    }
    this.props.onChange(this.props.controller.editorState)
    this.setState({sizeX:0, sizeY: 0})
  }
  render(){
    return (
      <div>
        <Badge
          badgeContent={`${this.state.sizeX}, ${this.state.sizeY}`}
          secondary={true}
          badgeStyle={{top: 10, left: 10, height: 40, width: 40}}
        >

        <IconButton
          onTouchTap={this.handleTouchTap}
          style={{height: "48px"}}
          iconStyle={{width: "48px", height: "48px"}}
          label={"Insert table"}
        >
          <TableIcon />
        </IconButton>
      </Badge>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <TablePicker onChange={this.handleSizeChange} onSelect={this.handleChosenSize} />
        </Popover>
      </div>
    );
  }
}
