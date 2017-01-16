import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './App.js';
import Connect from './Connect.js';
import Chatroom from './Chatroom.js';


class Routing extends Component {
  render() {
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Connect} />
        <Route path="/chatroom/:username" component={Chatroom} />
      </Route>
    </Router>
  }
}

export default Routing;
