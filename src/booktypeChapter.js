export default class Chapter {
  constructor(id ,send){
    this.id = id || window.booktype.editor.edit.getChapterID()
    this.send = send || this.windowSend
  }
  windowSend = (command, args) => {
    return new Promise((resolve,reject)=>{
      window.booktype.sendToCurrentBook({
            command,
            chapter_id: this.id,
            ...args
          },
          (data) => {
            if(data.result === false){
              reject(data)
            }else{
              resolve(data)
            }

          },
          (error) => {
            reject(error)
          }
        );
    })
  }
  getAttachments = () => {
    return this.send("attachments_list")
  }
  setState = (state) => {

  }
  setStatus = (status) => {

  }
  save = () => {

  }
  remove = () => {

  }

  rename = () => {

  }

  hold = () => {

  }

  unhold = () => {

  }

  lock = () => {

  }

  unlock = () => {

  }

  split = () => {

  }

  getRevision = () => {

  }

  killLock = () => {

  }
  addComment = (content, text) => {
    return this.send("add_comment", {content, text})
  }

  replyComment = (comment_id, content) => {
    return this.send("reply_comment", {comment_id, content})
  }

  getComments = (resolved) => {
    return this.send("get_comments", {resolved})
  }

  saveAllComments = (local_comments) => {
    return this.send("save_bulk_comments", {local_comments})
  }

  resolveComment = (comment_id) => {
    return this.send("resolve_comment", {comment_id})
  }

  deleteComment = (comment_id) => {
    return this.send("delete_comment", {comment_id})

  }

}
