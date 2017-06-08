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
    position: "absolute",
    float: "right",
    right: 160,
    top: 0,
    margin: 0,
  }
}


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
    if(window.booktype){

      window.booktype.sendToCurrentBook({
        'command': 'get_comments',
        'resolved': false,
        'chapter_id': window.booktype.editor.edit.getChapterID()
      },
      function (data) {
        console.log(data)
      }
    );

    }
  }


  componentWillReceiveProps(nextProps){
//     const comments = [
//     {
//       "local": true,
//       "cid": "01033682-c964-4821-9ad0-c5b0625d83ea",
//       "content": "hello",
//       "text": "d sd sd s s s",
//       "date": 1496920730,
//       "chapter_id": "10981",
//       "author": {
//         "name": "Vasilis kefallinos",
//         "username": "vkefallinos",
//         "avatar": "/_utils/profilethumb/vkefallinos/thumbnail.jpg?width=35"
//       },
//       "replies": []
//     }
//   ],
//   "channel" : "/booktype/book/1669/1.0/",
//   "uid" : 2451
// }
// ]
    const items = document.querySelectorAll(`[data-${this.props.query}]`)
    this.items = []
    const existing =[]
    const submitComment = (comments, key)=>{
      console.log(comments)
      if(window.booktype){
        comments[0].local=true
        comments[0].cid = key
        comments[0].chapter_id = window.booktype.editor.edit.getChapterID()
        comments[0].author.name = window.booktype.username
        comments[0].author.username = window.booktype.username
        comments[0].author.avatar=`/_utils/profilethumb/${window.booktype.username}/thumbnail.jpg?width=35`
        comments[0].replies = []
        window.booktype.sendToCurrentBook({
              'command': 'save_bulk_comments',
              'chapter_id': window.booktype.editor.edit.getChapterID(),
              'local_comments': comments
            },
            function (data) {
              if (data.result === false) {
                var noPermissions = window.booktype._('no_permissions', 'You do not have permissions for this.')
                window.booktype.utils.alert(noPermissions);
                return;
              }


              // pull latest comments from server
              // PubSub.pub('booktype-pull-latest-comments');
            }
          );
      }
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
          top: item.getBoundingClientRect().top-60-window.scrollY,
          header: ()=><CommentBoxSummary comments={data.comments}/>,
          body: ()=><CommentBody userId={nextProps.controller.userId} metaKey={metaKey} comments={data.comments} onSubmit={submitComment}/>
        })
        existing.push(item.dataset[this.props.query])
      }
    })
    if(nextProps.controller.currentInlineStyle.has("COMMENT")){
      const key = nextProps.controller.currentBlock.getMetaAt(
          nextProps.controller.selection.getFocusOffset()
        )
        .get("COMMENT")
      if(key !== this.state.active){
        this.activate(key)
      }
    }else{
      this.activate(null)
    }
  }
  activate=(key)=>{
    if(key && key === this.state.active){
      this.setState({active: null})
      this.styleSheet.deleteRule(0)
    }else if(key){
      this.setState({active:key})
      this.styleSheet.insertRule(`[data-comment="${key}"]{background-color: yellow !important;}`,0)
    }else{
      if(this.styleSheet.rules.length){
        this.styleSheet.deleteRule(0)
      }
      this.setState({active:null})
    }
  }
  render() {
    let topStart = 0

    return (
      <ul style={{...styles.collapsible, top: -window.scrollY}} >
        {this.items.map((item, idx)=>{
          if(topStart<=item.top-25){
            topStart = item.top
          }else{
            topStart+=40
          }
          const active = this.state.active === item.key
          if(active){
            topStart -=30
          }
          return <SideContentItem onClick={e=>this.activate(item.key)} {...item}
              position={topStart}
              active={active} key={idx} />
        })}
      </ul>
    )
  }
}
export default SideContent;
