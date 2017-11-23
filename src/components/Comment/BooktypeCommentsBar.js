import React from 'react';
// import {List, ListItem} from 'material-ui/List';
// import Avatar from 'material-ui/Avatar';
// import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
// import IconButton from '../../IconButton';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
// import TextField from 'material-ui/TextField';
// import Popover from 'material-ui/Popover';
// import Drawer from 'material-ui/Drawer';




export default class BooktypeCommentBar extends React.PureComponent {
  constructor(props) {
    super(props);
    // get comments
    // loop through comments and find comment key
    // get the absolute position of the comments
    // populate comments
    this.state = {
      comments: [],
      open: true
    };
    this.refreshComments();

  }

  replyToComment = (cid, content) => {
    this.props.controller.chapter.replyComment(cid, content).then((res) => {
      this.refreshComments();
    });
  }

  shouldComponentUpdate() {
    const currentComment = this.props.controller.getCurrentMetaKey("COMMENT");
    console.log(currentComment);
    if (currentComment) {
      if (currentComment === this.state.currentComment) {
        return false;
      }
      this.setState({currentComment});
      return true;
    }
    if (this.state.currentComment) {
      this.setState({currentComment});
      return true;
    }
    return false;
  }

  componentWillUpdate() {
    // const commentsLength = document.querySelectorAll("[data-comment]").length
    // this.setState({commentsLength})
    this.refreshComments();

  }

  refreshComments = () => {
    // this.props.controller.chapter.getComments().then((data)=>{
    //   this.setState({comments: data.comments.reverse().map(comment=>{
    //     return {...comment, replies: comment.replies.reverse()}
    //   })})
    // })
  }

  render() {
    return (
      <div></div>
    );
  }
}
