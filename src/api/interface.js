/* eslint-disable */
class ApiInterface {
  constructor(props) {
    this.documentID = props.documentID;
    this.direction = props.direction;
    this.language = props.language;
    this.autosave = props.autosave;
  }

  getCurrentUser = () => {
    throw {error: 'Not Implemented Error'}
  };

  getUsers = () => {
    throw {error: 'Not Implemented Error'}
  };

  getContent = () => {
    throw {error: 'Not Implemented Error'}
  };

  saveContent = () => {
    throw {error: 'Not Implemented Error'}
  };

  getImages = () => {
    throw {error: 'Not Implemented Error'}
  };

  uploadImage = () => {
    throw {error: 'Not Implemented Error'}
  };

  getThemes = () => {
    throw {error: 'Not Implemented Error'}
  };

  getFonts = () => {
    throw {error: 'Not Implemented Error'}
  };

  getComments = () => {
    throw {error: 'Not Implemented Error'}
  };

  addComment = () => {
    throw {error: 'Not Implemented Error'}
  };

  replyComment = () => {
    throw {error: 'Not Implemented Error'}
  };

  resolveComment = () => {
    throw {error: 'Not Implemented Error'}
  };

  deleteComment = () => {
    throw {error: 'Not Implemented Error'}
  };

}

export default ApiInterface;
