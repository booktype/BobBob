import React from 'react';
import styles from './commentStyle';


const CommentBoxSummary = (props) => {
  return (
    <div>
      {props.comments.map((comment, idx) => {
        return (
          <span key={idx} style={styles.circleImage}>
            <img style={styles.commentImage} src={comment.author.avatar}/>
          </span>
        );
      })
      }
    </div>
  );
};
const Comment = (props) => {
  return (
    <li style={styles.comment}>
      <span style={styles.inlineCommentImage}>
        <img style={styles.commentImage} src={props.author.avatar}/>
      </span>
      <span style={styles.comment}>
        <span style={styles.commentUser}>
          {props.author.name}
        </span>
        <time style={styles.commentTime}>{props.date}</time>
        <p style={styles.commentContent}>{props.content}</p>
      </span>
    </li>
  );
};
const CommentForm = (props) => {
  return (
    <form style={styles.commentForm}>
      <textarea style={styles.commentInput} placeholder={"Add Comment"}></textarea>
      <button onClick={props.onSubmit} style={styles.commentButton}>Post
      </button>
    </form>
  );
};

const CommentBody = (props) => {
  console.log(props);
  if (props.comment) {
    return (
      <div>
        <ul>
          <Comment {...props.comment} />
          {
            props.comment.replies ? props.comment.replies.map((comment, idx) => {
              return (<Comment {...comment} key={idx}/>);
            }) : null
          }
        </ul>
        <CommentForm onSubmit={(e) => {
          e.preventDefault();
          const content = e.target.previousElementSibling.value;
          props.onReply(
            content, props.comment.cid
            , props.metaKey);
        }}/>
      </div>
    );
  } else {
    return (
      <CommentForm onSubmit={(e) => {
        e.preventDefault();
        const content = e.target.previousElementSibling.value;
        props.onSubmit(
          content
          , props.metaKey);
      }}/>

    );
  }
};
export {CommentBody, CommentBoxSummary};
