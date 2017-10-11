class ApiInterface {
  constructor(props) {
    this.documentID = props.documentID;
    this.direction = props.direction;
    this.language = props.language;
    this.autosave = props.autosave;
  }

  getCurrentUser = () => {
    throw 'Not Implemented Error'
  };

  getUsers = () => {
    throw 'Not Implemented Error'
  };

  getContent = () => {
    throw 'Not Implemented Error'
  };

  saveContent = () => {
    throw 'Not Implemented Error'
  };

  getImages = () => {
    throw 'Not Implemented Error'
  };

  uploadImage = () => {
    throw 'Not Implemented Error'
  };

  getThemes = () => {
    throw 'Not Implemented Error'
  };

  getFonts = () => {
    throw 'Not Implemented Error'
  };

  getComments = () => {
    throw 'Not Implemented Error'
  };

  addComment = () => {
    throw 'Not Implemented Error'
  };

  replyComment = () => {
    throw 'Not Implemented Error'
  };

  resolveComment = () => {
    throw 'Not Implemented Error'
  };

  deleteComment = () => {
    throw 'Not Implemented Error'
  };

}

export default ApiInterface;
