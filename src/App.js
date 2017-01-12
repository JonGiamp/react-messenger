import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import './App.css';
import Home from './Home.js';
import About from './About.js';
import Inbox from './Inbox.js';

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/inbox">Inbox</Link></li>
        </ul>

        {/*
          next we replace `<Child>` with `this.props.children`
          the router will figure out the children for us
        */}
        {this.props.children}
      </div>
    )
  }
}

// Finally, we render a <Router> with some <Route>s.
// It does all the fancy routing stuff for us.
render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox} />
    </Route>
  </Router>
), document.body)

export default App;
