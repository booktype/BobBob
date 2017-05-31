import React from 'react';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FormatListBulletedType from '../../../icons/formatListBulleted';
import ArrowDown from '../../../icons/arrowDownDropCircleOutline';

const styles = {
  listEmptyLine: {
    "height": "2px",
    "marginLeft": "4px",
    "marginRight": "4px",
    "backgroundColor": "#000000",
    "width": 30,
    "position": "absolute",
    "marginTop": "8%",
    "outline": "1px solid"
  }
}
const ListEmptyLine = () => (
  <li><span style={styles.listEmptyLine}></span></li>
)
export default class PopoverExampleSimple extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
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

  render() {
    return (
      <div style={{display: "inline"}}>
        <span style={{display: "flex"}}>
          <IconButton style={{float: "left", padding: 2, display: "block"}} tooltip="Bulleted List">
            <FormatListBulletedType />
          </IconButton>
          <IconButton
            style={{float: "left", padding: 2, display: "block"}}
            iconStyle={{widht: 16, height: 16, marginLeft: -50}}
            onTouchTap={this.handleTouchTap}
            tooltip="Bullet types">
            <ArrowDown />
          </IconButton>
        </span>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu style={{width: 100}}>
            <MenuItem >
              <ul style={{listStyleType: "disc" ,marginLeft: 8}}>
                <ListEmptyLine />
                <ListEmptyLine />
                <ListEmptyLine />
              </ul>
            </MenuItem>
            <MenuItem >
              <ul style={{listStyleType: "circle",marginLeft: 8}}>
                <ListEmptyLine />
                <ListEmptyLine />
                <ListEmptyLine />
              </ul>
            </MenuItem>
            <MenuItem >
              <ul style={{listStyleType: "square",marginLeft: 8}}>
                <ListEmptyLine />
                <ListEmptyLine />
                <ListEmptyLine />
              </ul>
            </MenuItem>
          </Menu>
        </Popover>
      </div>
    );
  }
}
