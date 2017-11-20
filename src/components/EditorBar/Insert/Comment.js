import React from 'react';
import IconButton from '../../IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import CommentIcon from '../../../icons/comment';
import {RichUtils} from 'draft-js';


export default class CommentButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      content: ""
    };
  }

  handleOpen = () => {

    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  componentWillReceiveProps(nextProps) {
    this.setState({text: nextProps.controller.getSelectedText()});
  }

  handleChange = (e) => {
    this.setState({content: e.target.value});
  }
  handleTouchTap = (event) => {
    // This prevents ghost click.
    let editorState = RichUtils.toggleInlineStyleWithMeta(
      this.props.controller.editorState,
      "COMMENT",
      {
        comment: {}
      }
    );
    const metaKey = editorState.getCurrentContent().getLastCreatedMetaKey();
    this.props.controller.chapter.addComment(this.state.content, metaKey).then((res) => {
      console.log(res);
      this.props.controller.onSave();
    });
    event.preventDefault();
    this.props.onChange(
      editorState
    );
    this.handleClose();
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={!this.state.content}
        onTouchTap={this.handleTouchTap}
      />,
    ];
    return (
      <div style={{display: 'inline-block'}}>
        <IconButton
          onTouchTap={this.handleOpen}
          label={"Insert Comment"}
        >
          <CommentIcon/>
        </IconButton>
        <Dialog
          title="Add a comment"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <p style={{backgroundColor: "yellow"}}>{this.state.text}</p>
          <TextField
            hintText="Insert Comment"
            value={this.state.content}
            onChange={this.handleChange}
          />
        </Dialog>
      </div>
    );
  }
}
