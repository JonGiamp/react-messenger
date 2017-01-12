import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import Connect from './Connect.js';
import Chatroom from './Chatroom.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: ""
    };
  }

  setName(name) {
    this.setState({
      name: this.name
    });
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Connect} />
      <Route path="chatroom" component={Chatroom} />
    </Route>
  </Router>
), document.body)

export default App;
