import React from 'react';
// import IconButton from '../../IconButton';
// import CommentIcon from '../../../icons/comment';
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
    return (
      <div style={{display: 'inline-block'}}>
        
      </div>
    );
  }
}
