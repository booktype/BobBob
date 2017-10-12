import React from 'react';
import ReactDOM from 'react-dom';
import reactTapPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BobbobEditor from './containers/Editor';
import BooktypeApi from './api/booktype'


reactTapPlugin();
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: 'rgb(224, 223, 225)',
    accent1Color: 'rgb(255, 103, 0)'
  },
  appBar: {
    height: 50,
  },
});
const BobBob = ({api, toolbarContainer}) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <BobbobEditor api={api} toolbarContainer={toolbarContainer}/>
  </MuiThemeProvider>
);

window.EditorController = class {
  constructor(api, contentContainer) {
    this._container = contentContainer;
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
    return ReactDOM.unmountComponentAtNode(this._container);
  }

  getDocumentID () {
    return this._api.documentID
  }
};

window.BooktypeApi = BooktypeApi;
