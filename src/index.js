import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BobbobEditor from './containers/Editor';
import reactTapPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

reactTapPlugin();
ReactDOM.render(
  <MuiThemeProvider>
    <BobbobEditor />
  </MuiThemeProvider>,
  document.getElementById('app')
)
