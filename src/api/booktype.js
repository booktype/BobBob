import axios from 'axios';
import {EditorState} from 'draft-js';
import ApiInterface from './interface';
import editorContentsToHTML from '../encoding/editorContentsToHTML';
import onPaste from '../handlers/onPaste';
import editorStateToJSON from '../encoding/editorStateToJSON';


class BooktypeApi extends ApiInterface {
  constructor(props) {
    super(props);
    this.bookID = props.bookID;
    this.booktypeURL = props.booktypeURL;
    this.apiToken = props.apiToken;

    // init axios instance
    this.axios = axios.create({
      baseURL: this.booktypeURL,
      timeout: 10000,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'csrftoken'
    });

  }

  _sputnikSend(command, args) {
    return new Promise((resolve, reject) => {
      window.booktype.sendToCurrentBook({
          command,
          chapter_id: this.documentID,
          ...args
        },
        (data) => {
          if (data.result === false) {
            reject(data)
          } else {
            resolve(data)
          }

        },
        (error) => {
          reject(error)
        }
      );
    })
  }

  _get(url) {
    return new Promise(
      (resolve, reject) => {
        this.axios.get(url).then(response => resolve(response.data))
      })
  };

  _patch(url, data) {
    return this.axios.patch(url, data)
  };

  _post(url, data) {
    return this.axios.post(url, data)
  };

  getCurrentUser = () => {
    return this._get(`/_api/v1/users/current/`)
  };

  getUsers = () => {
    return this._get(`/_api/v1/books/${this.bookID}/users`)
  };

  getContent = () => {
    return new Promise(
      (resolve, reject) => {
        this._get(`/_api/v1/books/${this.bookID}/chapters/${this.documentID}/`)
          .then(data => {
              let content;

              if (!data.content_json) {
                content = editorStateToJSON(
                  onPaste(EditorState.createEmpty(), data.content)
                )
              } else {
                content = data.content_json
              }
              resolve(JSON.parse(content))
            }
          )
      })
  };

  saveContent = (content) => {
    let mainEditor = document.querySelector("[data-contents]");
    mainEditor = mainEditor.cloneNode(true);
    const content_html = editorContentsToHTML(mainEditor);
    return this._patch(
      `/_api/v1/books/${this.bookID}/chapters/${this.documentID}/`,
      {
        content_json: content,
        content: content_html
      }
    )
  };

  getImages = () => {
    return this._get(`_api/v1/books/${this.bookID}/attachments`)
  };

  uploadImage = (file) => {
    let data = new FormData();
    data.append('file', file);
    return this._post(`_api/v1/books/${this.bookID}/attachments`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    )
  };

  getThemes = () => {
    return this._get(`_api/v1/themes`);
  };

  getFonts = () => {
    return new Promise((resolve, reject) => {
      this._get(`_api/v1/themes`).then(({data}) => {
        resolve(data.reduce((fonts, theme) => {
          return fonts.concat(theme.fonts)
        }, []))
      })
    })
  };

  getComments = (resolved = false) => {
    return this._sputnikSend('get_comments', {
      resolved
    })
  };

  addComment = (content, text) => {
    return this._sputnikSend("add_comment", {content, text})
  };

  replyComment = (content, comment_id) => {
    return this._sputnikSend("reply_comment", {comment_id, content})
  };

  resolveComment = (comment_id) => {
    return this._sputnikSend("resolve_comment", {comment_id})
  };

  deleteComment = (comment_id) => {
    return this._sputnikSend("delete_comment", {comment_id})
  };
}


export default BooktypeApi
