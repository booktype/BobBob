import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router';
import BooktypeEditor from './pages/BooktypeEditor';
import reactTapPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

reactTapPlugin();


if(window.booktype){
  ReactDOM.render(
    <MuiThemeProvider>
      <BooktypeEditor />
    </MuiThemeProvider>,
    document.getElementById('content')
  )

}else{
  ReactDOM.render(
    <Router />,
    document.getElementById('app')
  );
}
