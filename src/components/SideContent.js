import React from 'react';
import SideContentItem from './SideContentItem';
import {CommentBoxSummary, CommentBody} from './Comment';
import {EditorState, Modifier} from 'draft-js'
const styles = {
  collapsible: {
    border: "none",
    boxShadow: "none",
    paddingLeft: 0,
    listStyleType: "none",
    // margin: ".5rem 0 1rem 0",
    position: "relative",
    float: "right",
    right: -20,
    top: 0,
    margin: 0,
  }
}
// let comments = [
//   {
//     "author": {
//       "name": "vasilis",
//       "avatar": "http://www.clker.com/cliparts/c/f/c/5/1368304250375490740bioman-avatar-3-blue-icon-hi.png"
//     },
//     "text": "amoasd",
//     "cid": "de00666c-7676-4049-8719-42580592f6af",
//     "content": "this is a comment",
//     "date": "1493832933"
//   },
//   {
//     "date": "1493832949",
//     "text": "",
//     "author": {
//       "name": "vasilis",
//       "avatar": "http://www.clker.com/cliparts/c/f/c/5/1368304250375490740bioman-avatar-3-blue-icon-hi.png"
//     },
//     "content": "and another anwser\n",
//     "cid": "515e69e2-856d-4c39-a656-bf804c98dfcb"
//   }, {
//     "date": "1493832941",
//     "text": "",
//     "author": {
//       "name": "vasilis",
//       "avatar": "http://www.clker.com/cliparts/c/f/c/5/1368304250375490740bioman-avatar-3-blue-icon-hi.png"
//     },
//     "content": "and this is an answer",
//     "cid": "f24e11c6-81db-4a5a-ac06-b6836f73776e"
//   }
// ]


class SideContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: null
    }
    var styleEl = document.createElement('style'),
    styleSheet;

    // Append style element to head
    document.head.appendChild(styleEl);

    // Grab style sheet
    this.styleSheet = styleEl.sheet;

    this.items= []
  }
  componentWillReceiveProps(nextProps){
    const items = document.querySelectorAll(`[data-${this.props.query}]`)
    this.items = []
    const existing =[]
    const submitComment = (comments, key)=>{
      console.log(comments, key)
      const currentContent = nextProps.controller.currentContent
      let editorState = EditorState.set(
        nextProps.controller.editorState,
        {
          currentContent: Modifier.mergeMetaData(currentContent, key, {
            comments
          })
        }
      )
      nextProps.onChange(editorState)
      nextProps.controller.userId
      console.log()
    }
    items.forEach((item)=>{
      if(!existing.includes(item.dataset[this.props.query])){
        const metaKey = item.dataset[this.props.query]
        const data = nextProps
                     .controller
                     .currentContent
                     .getMetaMap()
                     .get(metaKey)
                     .getData()

        this.items.push({
          key: metaKey,
          top: item.getBoundingClientRect().top-90+window.scrollY,
          header: ()=><CommentBoxSummary comments={data.comments}/>,
          body: ()=><CommentBody userId={nextProps.controller.userId} metaKey={metaKey} comments={data.comments} onSubmit={submitComment}/>
        })
        existing.push(item.dataset[this.props.query])
      }
    })
  }
  activate=(index, key)=>{
    if(index === this.state.active){
      this.setState({active: null})
      this.styleSheet.deleteRule(0)
    }else{
      this.setState({active:index})
      this.styleSheet.insertRule(`[data-comment="${key}"]{background-color: yellow !important;}`,0)
    }
  }
  render() {
    let topStart = 0

    return (
      <ul style={styles.collapsible} >
        {this.items.map((item, idx)=>{
          if(topStart<=item.top-25){
            topStart = item.top
          }else{
            topStart+=30
          }
          const active = this.state.active === idx
          if(active){
            topStart -=30
          }
          return <SideContentItem onClick={e=>this.activate(idx, item.key)} {...item}
              position={topStart}
              active={active} key={idx} />
        })}
      </ul>
    )
  }
}
export default SideContent;
