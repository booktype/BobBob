import React from 'react';
import ReactDOM from 'react-dom';
import reactTapPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import BobbobEditor from './containers/Editor';
import BooktypeApi from './api/booktype'


reactTapPlugin();

const BobBob = ({api, toolbarContainer}) => (
  <MuiThemeProvider>
    <BobbobEditor api={api} toolbarContainer={toolbarContainer}/>
  </MuiThemeProvider>
);

window.EditorController = class {
  constructor(api, contentContainer, toolbarContainer) {
    this._container = contentContainer;
    this._toolbar = toolbarContainer;
    this._api = api;
  }
  _render() {
    ReactDOM.render(
      <BobBob api={this._api} toolbarContainer={this._toolbar}/>,
      this._container
    );
  }

  initEditor(documentID) {
    this._api.documentID = documentID;
    this._render()
  }

  destroyEditor() {
    this._api.documentID = null;
    return ReactDOM.unmountComponentAtNode(this._container);
  }

  getDocumentID () {
    return this._api.documentID
  }
};

window.BooktypeApi = BooktypeApi;
