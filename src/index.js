import React from 'react';
import ReactDOM from 'react-dom';
import reactTapPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import BobbobEditor from './containers/Editor';
import BooktypeApi from './api/booktype'


reactTapPlugin();

const BobBob = ({api}) => (
  <MuiThemeProvider>
    <BobbobEditor api={api}/>
  </MuiThemeProvider>
);

window.EditorController = class {
  constructor(api, container) {
    this._container = container;
    this._api = api;
  }

  _render() {
    ReactDOM.render(
      <BobBob api={this._api}/>,
      this._container
    );
  }

  initEditor(documentID) {
    this._api.documentID = documentID;
    this._render()
  }

  destroyEditor() {
    this._api.documentID = null;
    ReactDOM.unmountComponentAtNode(this._container);
  }
};

window.BooktypeApi = BooktypeApi;
