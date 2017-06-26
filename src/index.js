import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router';
import BooktypeEditor from './pages/BooktypeEditor';
import reactTapPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'react-rpm';
reactTapPlugin();


if(window.booktype){
  const notify = window.booktype.ui.notify
  window.$("#content").show()
  window.booktype.ui.notify=function(type, more){
    console.log(type,more, "notify")
    notify(type, more)

  }
  const editChapter = window.booktype.editor.editChapter
  window.booktype.editor.editChapter = function(id, forced){
    console.log(id)
    ReactDOM.render(
      <MuiThemeProvider>
        <BooktypeEditor chapterId={id} />
      </MuiThemeProvider>,
      document.getElementById('content')
    )
    editChapter(id,forced)
  }
  if(window.document.location.hash.includes("#edit/")){
    console.log("ion aca-ta")
    ReactDOM.render(
      <MuiThemeProvider>
        <BooktypeEditor chapterId={window.document.location.hash.replace("#edit/","")}/>
      </MuiThemeProvider>,
      document.getElementById('content')
    )
  }

}else{
  ReactDOM.render(
    <Router />,
    document.getElementById('app')
  );
}
