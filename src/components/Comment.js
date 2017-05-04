import React from 'react';
const styles = {
  circleImage: {
    "position": "absolute",
    "width": "30px",
    "height": "30px",
    "overflow": "hidden",
    "left": "15px",
    "display": "inline-block",
    "verticalAlign": "middle",
    "borderRadius": "50%"
  },
  commentImage: {
    width: "100%"
  },
  inlineCommentImage:{
    "position": "absolute",
    "width": "30px",
    "height": "30px",
    "overflow": "hidden",
    "display": "inline-block",
    "verticalAlign": "middle",
    "borderRadius": "50%",
    "left": "-35px"
  },
  comment: {
    "position": "relative",
    "display": "block",
    "padding": "0.75rem 1.25rem",
    "marginBottom": "0",
    "border": "none",
    "borderRadius": "0",
    "backgroundColor": "white"
  },
  commentUser: {
    "fontSize": "14px",
    "fontWeight": "500",
    "color": "rgba(0,0,0,.8)",
    "textDecoration": "none"
  },
  commentTime: {
    "fontSize": "12px",
    "color": "rgba(0,0,0,.5)",
    "fontWeight": "400",
    "marginLeft": "6px"
  },
  commentContent: {
    "marginBottom": "0",
    "whiteSpace": "normal",
    "color": "rgba(0,0,0,.8)",
    "fontSize": "14px",
    "marginTop": "0.215em"
  },
  commentForm: {
    "textAlign": "center",
    "width": "50%",
    "margin": "0 auto"
  },
  commentInput: {
    "display": "block",
    "width": "100%",
    "border": "0",
    "padding": "10px 5px",
    "background": "white no-repeat",
    "backgroundImage": "linear-gradient(to bottom, #1abc9c, #1abc9c), linear-gradient(to bottom, silver, silver)",
    "backgroundSize": "0 2px, 100% 1px",
    "backgroundPosition": "50% 100%, 50% 100%",
    "transition": "background-size 0.3s cubic-bezier(0.64, 0.09, 0.08, 1)"
  },
  commentButton: {
    "padding": "0.5rem 1rem",
    "fontSize": "1rem",
    "lineHeight": "1.25",
    "borderRadius": "0.25rem",
    "color": "#fff",
    "backgroundColor": "#5cb85c",
    "borderColor": "#5cb85c",
    "display": "inline-block",
    "fontWeight": "normal",
    "textAlign": "center",
    "whiteSpace": "nowrap",
    "verticalAlign": "middle",
    "WebkitUserSelect": "none",
    "MozUserSelect": "none",
    "MsUserSelect": "none",
    "userSelect": "none",
    "border": "1px solid transparent",
    "WebkitTransition": "all 0.2s ease-in-out",
    "OTransition": "all 0.2s ease-in-out",
    "transition": "all 0.2s ease-in-out"
  }
}

const CommentBoxSummary = (props) => {
  return (
    <div>
      {props.comments.map((comment, idx) => {
        return (
          <span key={idx} style={styles.circleImage}>
            <img style={styles.commentImage} src={comment.author.avatar}/>
          </span>
          )
        })
      }
    </div>
  )
}
const Comment = (props) => {
  return (
    <li style={styles.comment}>
      <span style={styles.inlineCommentImage}>
        <img style={styles.commentImage}  src={props.author.avatar}/>
      </span>
      <span style={styles.comment}>
        <span style={styles.commentUser}>
          {props.author.name}
        </span>
        <time style={styles.commentTime}>{props.date}</time>
        <p style={styles.commentContent}>{props.content}</p>
      </span>
    </li>
  )
}
const CommentForm = (props) => {
  return (
    <form style={styles.commentForm}>
      <textarea style={styles.commentInput} placeholder={"Add Comment"}></textarea>
      <button onClick={props.onSubmit} style={styles.commentButton}>Post</button>
    </form>
  )
}

const CommentBody = (props) => {
  return (
    <div>
      <ul>
        {
          props.comments.map((comment, idx) => {
            return (<Comment {...comment} key={idx}/>)
          })
        }
      </ul>
      <CommentForm onSubmit={props.onSubmit}/>
    </div>
  )
}
export {CommentBody ,CommentBoxSummary}
