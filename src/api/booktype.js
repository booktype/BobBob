import axios from 'axios';
import ApiInterface from './interface';
import editorContentsToHTML from '../encoding/editorContentsToHTML';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

class BooktypeApi extends ApiInterface {
  constructor(props){
    super(props)
    this.bookID = this.props.bookID
    this.booktypeURL = this.props.booktypeURL
    this.apiToken = this.props.apiToken
  }
  _sputnikSend(command, args){
    return new Promise((resolve,reject)=>{
      window.booktype.sendToCurrentBook({
            command,
            chapter_id: this.props.documentID,
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
  _get(url){
    return axios.get(url)
  }
  _patch(url, data){
    return axios.patch(url, data)
  }
  _post(url, data){
    return axios.post(url, data)
  }
  getCurrentUser = () => {
    return this._get(`/_api/v1/users/current/`)
  }
  getUsers = () => {
    return this._get(`/_api/v1/books/${this.bookID}/users`)
  }
  getContent = () => {
    return this._get(`/_api/v1/books/${this.bookID}/chapters/${this.documentID}/`)
  }
  saveContent = (content) => {
    let mainEditor = document.querySelector("[data-contents]")
    mainEditor = mainEditor.cloneNode(true)
    const content_html = editorContentsToHTML(mainEditor)
    return this._patch(
      `/_api/v1/books/${this.bookID}/chapters/${this.documentID}/`,
      {
        content_json: content,
        content: content_html
      }
    )
  }
  getImages = () => {
    return this._get(`_api/v1/books/${this.bookID}/attachments`)
  }
  uploadImage = (file) => {
    let data = new FormData()
    data.append('file', file)
    return this._post(`_api/v1/books/${this.bookID}/attachments`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    )
  }
  getThemes = () => {

  }

  getFonts = () => {
    return new Promise((resolve,reject)=>{
      this._get(`_api/v1/themes`).then((response)=>{
        resolve(response.reduce((fonts, theme)=>{
          return fonts.concat(theme.fonts)
        },[]))
      })
    })
  }

  getComments = (resolved=false) => {
    return this._sputnikSend('get_comments', {
      resolved
    })
  }

  addComment = (content, text) => {
    return this._sputnikSend("add_comment", {content, text})
  }

  replyComment = (content, comment_id) => {
    return this._sputnikSend("reply_comment", {comment_id, content})
  }

  resolveComment = (comment_id) => {
    return this._sputnikSend("resolve_comment", {comment_id})
  }

  deleteComment = (comment_id) => {
    return this._sputnikSend("delete_comment", {comment_id})
  }
}
export default BooktypeApi
