import React from 'react';
import {
  EditorState,
  Modifier
} from 'draft-js';
import SideContentItem from './SideContentItem';
import {CommentBoxSummary, CommentBody} from './Comment/Comment';


const styles = {
  collapsible: {
    border: "none",
    boxShadow: "none",
    paddingLeft: 0,
    listStyleType: "none",
    // margin: ".5rem 0 1rem 0",
    position: "absolute",
    float: "right",
    right: 160,
    top: 0,
    margin: 0,
  }
};


class SideContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null
    };
    var styleEl = document.createElement('style'),
      styleSheet;

    // Append style element to head
    document.head.appendChild(styleEl);

    // Grab style sheet
    this.styleSheet = styleEl.sheet;

    this.items = [];
    this.refreshComments();
  }

  refreshComments = () => {
    if (window.booktype) {

      window.booktype.sendToCurrentBook({
          'command': 'get_comments',
          'resolved': false,
          'chapter_id': window.booktype.editor.edit.getChapterID()
        },
        (data) => {
          this.setState({comments: data.comments});
        });
    }
  }
  submitReply = (content, comment_id, key) => {
    window.booktype.sendToCurrentBook({
        'command': 'reply_comment',
        'chapter_id': window.booktype.editor.edit.getChapterID(),
        'content': content,
        'text': key,
        comment_id
      },
      (data) => {
        console.log(data);

        if (data.result === false) {
          var noPermissions = window.booktype._('no_permissions', 'You do not have permissions for this.');
          window.booktype.utils.alert(noPermissions);
          return;
        }
        const currentContent = this.props.controller.currentContent;
        let editorState = EditorState.set(
          this.props.controller.editorState,
          {
            currentContent: Modifier.mergeMetaData(currentContent, key, {
              comment: data.new_comment
            })
          }
        );
        this.props.onChange(editorState);
      }
    );
  }
  submitComment = (comment, key) => {

    if (window.booktype) {
      window.booktype.sendToCurrentBook({
          'command': 'add_comment',
          'chapter_id': window.booktype.editor.edit.getChapterID(),
          'content': comment,
          'text': key
        },
        (data) => {
          console.log(data);

          if (data.result === false) {
            var noPermissions = window.booktype._('no_permissions', 'You do not have permissions for this.');
            window.booktype.utils.alert(noPermissions);
            return;
          }
          const currentContent = this.props.controller.currentContent;
          let editorState = EditorState.set(
            this.props.controller.editorState,
            {
              currentContent: Modifier.mergeMetaData(currentContent, key, {
                comment: data.new_comment
              })
            }
          );
          this.props.onChange(editorState);
        }
      );
    }
  }


  componentWillReceiveProps(nextProps) {

    const items = document.querySelectorAll(`[data-${this.props.query}]`);
    this.items = [];
    const existing = [];

    items.forEach((item) => {
      if (!existing.includes(item.dataset[this.props.query])) {
        const metaKey = item.dataset[this.props.query];
        const data = nextProps
          .controller
          .currentContent
          .getMetaMap()
          .get(metaKey)
          .getData();
        console.log(data);
        this.items.push({
          key: metaKey,
          top: item.getBoundingClientRect().top - 60 - window.scrollY,
          header: () => <CommentBoxSummary comments={data.comments}/>,
          body: () => <CommentBody
            userId={nextProps.controller.userId}
            metaKey={metaKey}
            comment={data.comment}
            onSubmit={this.submitComment}
            onReply={this.submitReply}
          />
        });
        existing.push(item.dataset[this.props.query]);
      }
    });
    if (nextProps.controller.currentInlineStyle.has("COMMENT")) {
      const key = nextProps.controller.currentBlock.getMetaAt(
        nextProps.controller.selection.getFocusOffset()
      )
        .get("COMMENT");
      if (key !== this.state.active) {
        this.activate(key);
      }
    } else {
      this.activate(null);
    }
  }

  activate = (key) => {
    if (key && key === this.state.active) {
      this.setState({active: null});
      this.styleSheet.deleteRule(0);
    } else if (key) {
      this.setState({active: key});
      this.styleSheet.insertRule(`[data-comment="${key}"]{background-color: yellow !important;}`, 0);
    } else {
      if (this.styleSheet.rules.length) {
        this.styleSheet.deleteRule(0);
      }
      this.setState({active: null});
    }
  }

  render() {
    let topStart = 0;

    return (
      <ul style={{...styles.collapsible, top: -window.scrollY}}>
        {this.items.map((item, idx) => {
          if (topStart <= item.top - 25) {
            topStart = item.top;
          } else {
            topStart += 40;
          }
          const active = this.state.active === item.key;
          if (active) {
            topStart -= 30;
          }
          return <SideContentItem onClick={e => this.activate(item.key)} {...item}
                                  position={topStart}
                                  active={active} key={idx}/>;
        })}
      </ul>
    );
  }
}


export default SideContent;
