import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router';

import reactTapPlugin from 'react-tap-event-plugin';
reactTapPlugin();





ReactDOM.render(
  <Router />,
  document.getElementById('app')
);
