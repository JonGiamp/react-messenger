import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './App.js';
import Connect from './Connect.js';
import Chatroom from './Chatroom.js';
import { SocketProvider } from 'socket.io-react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect("localhost:2222", {'forceNew':true });

ReactDOM.render(
  <SocketProvider socket={socket}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Connect} />
        <Route path="/chatroom/:username" component={Chatroom} />
      </Route>
    </Router>
  </SocketProvider>,
  document.getElementById('root')
);
