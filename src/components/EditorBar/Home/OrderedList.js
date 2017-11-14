import React from 'react';
import IconButton from '../../IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FormatListNumbers from '../../../icons/formatListNumbers';
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
};
const ListEmptyLine = () => (
  <li><span style={styles.listEmptyLine}></span></li>
);
export default class OrderedList extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      listStyleType: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.open !== this.state.open) {
      return true;
    }
    if (nextProps.ol === this.props.ol) {
      return false;
    }
    return true;
  }

  handleToggleList = (listStyleType) => {
    if (this.props.ol) {
      this.props.onChange(
        this.props.controller
          .setStyleAttr("listStyleType", listStyleType)
          .editorState
      );
    } else {
      this.props.onChange(
        this.props.controller.insertElementAfter("ol")
          .setStyleAttr("listStyleType", listStyleType)
          .appendChild("li").editorState
      );
    }
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
      <div style={{display: "inline-block"}}>
        <span style={{display: "flex"}}>
          <IconButton
            onTouchTap={() => this.handleToggleList("decimal")}
            tooltip="Bulleted List"
          >
            <FormatListNumbers color={this.props.ol ? "orange" : null}/>
          </IconButton>
          <IconButton
            onTouchTap={this.handleTouchTap}
            tooltip="Number types">
            <ArrowDown/>
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
            <MenuItem
              onTouchTap={() => this.handleToggleList("decimal")}
              style={{backgroundColor: this.props.ol && this.props.ol.listStyleType === "decimal" ? "orange" : null}}>
              <ol style={{listStyleType: "decimal", marginLeft: 8}}>
                <ListEmptyLine/>
                <ListEmptyLine/>
                <ListEmptyLine/>
              </ol>
            </MenuItem>
            <MenuItem
              onTouchTap={() => this.handleToggleList("lower-roman")}
              style={{backgroundColor: this.props.ol && this.props.ol.listStyleType === "lower-roman" ? "orange" : null}}

            >
              <ol style={{listStyleType: "lower-roman", marginLeft: 8}}>
                <ListEmptyLine/>
                <ListEmptyLine/>
                <ListEmptyLine/>
              </ol>
            </MenuItem>
            <MenuItem
              onTouchTap={() => this.handleToggleList("upper-roman")}
              style={{backgroundColor: this.props.ol && this.props.ol.listStyleType === "upper-roman" ? "orange" : null}}

            >
              <ol style={{listStyleType: "upper-roman", marginLeft: 8}}>
                <ListEmptyLine/>
                <ListEmptyLine/>
                <ListEmptyLine/>
              </ol>
            </MenuItem>
            <MenuItem
              onTouchTap={() => this.handleToggleList("upper-latin")}
              style={{backgroundColor: this.props.ol && this.props.ol.listStyleType === "upper-latin" ? "orange" : null}}

            >
              <ol style={{listStyleType: "upper-latin", marginLeft: 8}}>
                <ListEmptyLine/>
                <ListEmptyLine/>
                <ListEmptyLine/>
              </ol>
            </MenuItem>
            <MenuItem
              onTouchTap={() => this.handleToggleList("lower-latin")}
              style={{backgroundColor: this.props.ol && this.props.ol.listStyleType === "lower-latin" ? "orange" : null}}

            >
              <ol style={{listStyleType: "lower-latin", marginLeft: 8}}>
                <ListEmptyLine/>
                <ListEmptyLine/>
                <ListEmptyLine/>
              </ol>
            </MenuItem>
            <MenuItem
              onTouchTap={() => this.handleToggleList("lower-greek")}
              style={{backgroundColor: this.props.ol && this.props.ol.listStyleType === "lower-greek" ? "orange" : null}}
            >
              <ol style={{listStyleType: "lower-greek", marginLeft: 8}}>
                <ListEmptyLine/>
                <ListEmptyLine/>
                <ListEmptyLine/>
              </ol>
            </MenuItem>
          </Menu>
        </Popover>
      </div>
    );
  }
}
