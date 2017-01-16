import React, { Component } from 'react';
import catPic from './ico-cat.svg';

class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleSubmit(event) {
    if(this.state.name)
      this.props.router.push(`/chatroom/${this.state.name}`);
    // Maintenant je dois passer this.state.name en params à l'URL
    // NOTATION: Au lieu de passer le this.state.name maintenant, tu peux simplement
    // NOTATION: modifier dynamiquement le to avec {} par exemple
    event.preventDefault();
  }

  render() {
    return (
      <main className="page-connect">
        <div className="logo">
          <img src={ catPic } alt="Logo de l'application chat" />
        </div>
        <div className="connect">
          <input type="text" placeholder="Entrez votre pseudo..." value={this.state.value} onChange={this.handleChange} />
          <button onClick={this.handleSubmit}>Connexion</button>
        </div>
      </main>
    );
  }
}

export default Connect;
