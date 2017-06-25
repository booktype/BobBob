export default class Booktype {
  constructor(props){
    this.clientID = props.clientID
    this.CSRFToken = props.CSRFToken
  }
  setCSRFToken = () => {

  }
  setSessionId = () => {

  }
  setApiKey = () => {

  }
  setDomain = () => {

  }
  setClientID = (clientID) => {
    this.clientID = clientID
  }
  getBooks = () => {

  }
  getBook = (bookID) => {
    return
  }
  sendCommand = (command, data) => {
    axios.post('/_sputnik/',
    {
      clientID: this.clientID,
      messages:[{
        command,
        ...data
      }]
    },
    {
      headers:{
        "X-CSRFToken": this.CSRFToken
      }
    }
    )
  }
}
