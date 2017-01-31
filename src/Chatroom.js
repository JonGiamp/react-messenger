import React, { Component } from 'react';
import users from './images/users.svg';
import enveloppe from './images/envelope.svg';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

/********* TODO *********/
// Mettre à jour la liste d'user pour tout les clients à chaque nouvelle connexion
// Envoyer le message sur le serveur
// Enregistrer le message sur le serveur
// Mettre à jour l'historique des messages pour tout les clients


class TopBarContainer extends Component {
  render() {
    return(
      <header>
        <p>{this.props.username}</p>
        <div><img src={users} alt="users" onClick={this.props.openNav}/></div>
      </header>
    );
  }
}

class SideBarContainer extends Component {
  render() {
    return (
      <div id="mySidenav" className="sidenav">
    		<a href="javascript:void(0)" className="closebtn" onClick={this.props.closeNav}>&times;</a>
          { /* Generate user list */
            this.props.users.map((user) => {
              return (
                <li key={user.id}>{user.name}</li>
              );
            })
          }
    	</div>
    );
  }
}

class ChatBoxContainer extends Component {
  checkUsername = (name) => (name === this.props.username) ? "mine" : "other";

  render() {
    return (
      <section className="content">
        { /* Generate message list */
          this.props.messages.map((message) => {
            return (
              <div className={this.checkUsername(message.name)} key={message.id}>
                <p className="date">{message.name} le {message.date}</p>
        				<div className="post">
        					<p>{message.text}</p>
        				</div>
              </div>
            );
          })
        }
      </section>
    );
  }
}

class SendBoxContainer extends Component {
  render() {
    return (
      <section className="write-message">
        <SendBoxText {...this.props} />
        <SendBoxSend sendMessage={this.props.sendMessage}/>
      </section>
    );
  }
}

class SendBoxText extends Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.updateMessage(event.target.value);
  }

  render() {
    return (
      <textarea rows="3" placeholder="Ecrire le message..." value={this.props.message} onChange={this.handleChange}></textarea>
    );
  }
}

class SendBoxSend extends Component {
  render() {
    return (
      <button onClick={this.props.sendMessage} ><img src={enveloppe} alt="Icone envelope"/></button>
    );
  }
}

class Chatroom extends Component {
  constructor() {
    super();
    this.state = {
      history: [
        {name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", id: 1},
        {name: "Thomas", text: "Message de Thomas", date: "14 janvier 2017 à 18h00", id: 2},
        {name: "Kevin", text: "Message de Kevin", date: "14 janvier 2017 à 18h00", id: 3},
        {name: "Jonathan", text: "Message de Jon 2", date: "14 janvier 2017 à 18h00", id: 4},
        {name: "Mario", text: "It's a me, Mario !", date: "14 janvier 2017 à 18h00", id: 5},
        {name: "Booba", text: "aijjjjjjjfiaij fjaj aofâo a^kfpâfapakpf ^pijeg igri gerihgrhgjrdghj gjdgidgierj gierjgerp j", date: "14 janvier 2017 à 18h00", id: 6},
        {name: "Thomas", text: "aijjjjjjjfiaij fjaj aofâo a^kfpâfapakpf ^pijeg igri gerihgrhgjrdghj gjdgidgierj gierjgerp j", date: "14 janvier 2017 à 18h00", id: 7},
        {name: "Booba", text: "qzd q", date: "14 janvier 2017 à 18h00", id: 8}
      ],
      activeUsers: [
        {name: "Jonathan", id: 0},
        {name: "Thomas", id: 1},
        {name: "Ludovic", id: 2},
        {name: "Jordan", id: 3}
      ],
      message: ""
    };
    this.socket = null;
  }

  componentDidMount = () => {
    this.socket = io.connect("localhost:2222");
    this.socket.on('message');
    this.socket.emit('new user', { user: this.props.params.username });
  }

  updateMessage = (text) => {
    this.setState({
      message: text
    });
  }

  sendMessage = () => {
    if(this.state.message)
      // ID et DATE généré coté serveur
      // this.socket.emit('message', { name: this.props.params.username, text: this.state.message});
    event.preventDefault();
  }

  openNav = () => {
    document.getElementById("mySidenav").style.width = "100%";
    document.getElementById("main").style.overflow = "hidden";
  }

  closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.overflow = "auto";
  }

  render() {
    return(
      <main className="page-chat">
        <SideBarContainer closeNav={this.closeNav} users={this.state.activeUsers}/>
        <TopBarContainer username={this.props.params.username.replace(/-/g," ")} openNav={this.openNav} />
        <ChatBoxContainer messages={this.state.history} username={this.props.params.username}/>
    		<SendBoxContainer message={this.state.message} updateMessage={this.updateMessage} sendMessage={this.sendMessage}/>
    	</main>
    );
  }
}

export default Chatroom;
