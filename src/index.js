import React from 'react';
import ReactDOM from 'react-dom';
import reactTapPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import BobbobEditor from './containers/Editor';
import './index.css';
// import Dummy from './api/dummy'
import BooktypeApi from './api/booktype'



reactTapPlugin();
// ReactDOM.render(
//   <MuiThemeProvider>
//     <BobbobEditor api={api} />
//   </MuiThemeProvider>,
//   document.getElementById('app')
// )
const BobBob = ({api}) =>  (
  <MuiThemeProvider>
    <BobbobEditor api={api} />
  </MuiThemeProvider>
)

window.EditorController = class {
  constructor(api, container) {
    this._container = container;
    this._api = api;
  }
  _render() {
    ReactDOM.render(
      <BobBob api={this._api} />,
      this._container
    );
  }

  get api() {
    return this._api;
  }

  set api(value) {
    this._api = value;
    this._render();
  }

  initEditor(){
    this._render()
  }
  destroyEditor() {
    ReactDOM.unmountComponentAtNode(this._container);
  }
}
// const api = new Dummy({
//   documentID: 1,
//   direction: 'LTR',
//   language: 'en',
//   autosave: true
// })
// window.controller = new window.EditorController(api, document.querySelector('#app'))
// window.controller.initEditor()

window.BooktypeApi = BooktypeApi
