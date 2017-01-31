import React, { Component } from 'react';
import catPic from './images/ico-cat.svg';
import slug from 'slug';

class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  handleSubmit = (event) => {
    if(this.state.name)
      this.props.router.push(`/chatroom/${this.formatName(this.state.name)}`);
    event.preventDefault();
  }

  formatName = (name) => slug(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());

  render() {
    return (
      <main className="page-connect">
        <div className="logo">
          <img src={ catPic } alt="Logo de l'application" />
        </div>
        <div className="connect">
          <input type="text" placeholder="Entrez votre pseudo..."
            value={this.state.value}
            onChange={this.handleChange} />
          <a onClick={this.handleSubmit} className="btn">Connexion</a>
        </div>
      </main>
    );
  }
}

export default Connect;
