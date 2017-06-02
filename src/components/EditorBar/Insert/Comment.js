import React from 'react';
import IconButton from 'material-ui/IconButton';
import CommentIcon from '../../../icons/comment';
import {RichUtils} from 'draft-js'
export default class CommentButton extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.props.onChange(
      RichUtils.toggleInlineStyleWithMeta(
        this.props.controller.editorState,
        "COMMENT",
        {
          comments: []
        }
      )
    );
  };

  render(){
    return (
      <div>
        <IconButton
          onTouchTap={this.handleTouchTap}
          style={{height: "48px"}}
          iconStyle={{width: "48px", height: "48px"}}
          label={"Insert Comment"}
        >
          <CommentIcon/>
        </IconButton>
      </div>
    );
  }
}
