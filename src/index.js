import React from 'react';
import ReactDOM from 'react-dom';
import BobbobEditor from './containers/Editor';
import BooktypeApi from './api/booktype';
import DummyApi from './api/dummy';


const BobBob = ({api}) => (
  <BobbobEditor api={api}/>
);

window.EditorController = class {
  constructor(api, contentContainer) {
    this._api = api;
    this._container = contentContainer;
  }

  _render() {
    ReactDOM.render(
      <BobBob api={this._api}/>,
      this._container
    );
  }

  initEditor(documentID) {
    this._api.documentID = documentID;
    this._render();
  }

  destroyEditor() {
    this._api.documentID = null;
    return ReactDOM.unmountComponentAtNode(this._container);
  }

  getDocumentID() {
    return this._api.documentID;
  }
};

window.BooktypeApi = BooktypeApi;

const controller = new window.EditorController(new DummyApi({
  documentID: 1,
  direction: 'ltr'
}), document.querySelector('#app'));
controller.initEditor();
export default BobBob;
