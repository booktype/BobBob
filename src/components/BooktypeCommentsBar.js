import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Drawer from 'material-ui/Drawer';
const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);



export default class BooktypeCommentBar extends React.PureComponent {
  constructor(props){
    super(props)
    // get comments
    // loop through comments and find comment key
    // get the absolute position of the comments
    // populate comments
    this.state = {
      comments:[],
      open: true
    }
    this.refreshComments()

  }
  replyToComment = (cid, content) => {
    this.props.controller.chapter.replyComment(cid, content).then((res)=>{
      this.refreshComments()
    })
  }
  shouldComponentUpdate(){
    const currentComment = this.props.controller.getCurrentMetaKey("COMMENT")
    console.log(currentComment)
    if(currentComment){
      if(currentComment === this.state.currentComment){
        return false
      }
      this.setState({currentComment})
      return true
    }
    if(this.state.currentComment){
      this.setState({currentComment})
      return true
    }
    return false
  }
  componentWillUpdate(){
    // const commentsLength = document.querySelectorAll("[data-comment]").length
    // this.setState({commentsLength})
    this.refreshComments()

  }
  refreshComments = () => {
    this.props.controller.chapter.getComments().then((data)=>{
      this.setState({comments: data.comments.reverse().map(comment=>{
        return {...comment, replies: comment.replies.reverse()}
      })})
    })
  }
  render(){
    let top = 0
    return (
      <Drawer
        open={this.state.currentComment}
        openSecondary={true}
        >
        <List
          >
        {this.state.comments.map(comment=>{
          return (
              <ListItem
                style={{background: this.state.currentComment===comment.text?"yellow":null}}
                leftAvatar={<Avatar src={comment.author.avatar} />}
                rightIconButton={
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem
                      onTouchTap={()=>{
                        this.props.controller.chapter.resolveComment(comment.cid)
                        this.refreshComments()
                      }}>
                      Resolve
                    </MenuItem>
                    <MenuItem
                      onTouchTap={()=>{
                        this.props.controller.chapter.deleteComment(comment.cid)
                        this.refreshComments()

                      }}>Delete</MenuItem>
                  </IconMenu>
                }
                primaryText={comment.author.name}
                key={comment.cid}
                secondaryText={
                  <p>
                    <span style={{color: darkBlack}}>{comment.content}</span><br />
                  </p>
                }
                secondaryTextLines={2}
                primaryTogglesNestedList={true}
                nestedItems={
                  comment.replies.map(reply=>{
                    return (
                      <ListItem
                        leftAvatar={<Avatar src={reply.author.avatar}/>}
                        primaryText={reply.author.name}
                        key={reply.cid}
                        secondaryText={
                          <p>
                            <span style={{color: darkBlack}}>{reply.content}</span><br />
                          </p>
                        }
                      />
                    )
                  }).concat([
                    <ListItem
                      key={"reply"}
                      >
                      <TextField
                        hintText="Reply"
                        onKeyDown={(e)=>{
                          if(e.key === "Enter"){
                            this.replyToComment(comment.cid, e.target.value)
                          }
                        }}
                      />
                    </ListItem>
                  ])
                }
              />
          )
        })}
      </List>
      </Drawer>
    )
  }
}
