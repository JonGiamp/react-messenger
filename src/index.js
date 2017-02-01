import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './App.js';
import Connect from './Connect.js';
import Chatroom from './Chatroom.js';
import './App.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Connect} />
      <Route path="/chatroom/:username" component={Chatroom} />
    </Route>
  </Router>,
  document.getElementById('root')
);
