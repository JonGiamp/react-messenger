import React, { Component } from 'react';
import users from './images/users.svg';
import enveloppe from './images/envelope.svg';
import { socketConnect } from 'socket.io-react';
import monthName from './monthName.js'

/********* TODO *********/
// Gérer le disconect
// Implanter shouldComponentUpdate, propstype etc..
// CLean les node_modules
// Rajouter des messages systèmes ?

class TopBarContainer extends Component {
  render() {
    return(
      <header>
        <p>{this.props.username}</p>
        <div><img src={users} alt="users" onClick={this.props.toggleSideBar}/></div>
      </header>
    );
  }
}

class SideBarContainer extends Component {
  render() {
    return (
      <div id="mySidenav" className={`sidenav ${this.props.sideBarState}`}>
    		<a className="closebtn" onClick={this.props.toggleSideBar}>&times;</a>
          {
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
  checkUserId = (userId) => (userId === this.props.userId) ? "mine" : "other";

  render() {
    return (
      <section className="content">
        {
          this.props.messages.map((message) => {
            return (
              <div className={this.checkUserId(message.userId)} key={message.id}>
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
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    return (
      <button onClick={this.props.sendMessage}><img src={enveloppe} alt="Icone envelope"/></button>
    );
  }
}

class Chatroom extends Component {
  constructor() {
    super();
    this.state = {
      history: [ /* {name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", id: 1} */ ],
      activeUsers: [ /* {name: "Jonathan", id: 0} */ ],
      message: "",
      userId: null,
      sideBarState: "hidden"
    };
  }

  componentDidMount = () => {
    this.props.socket.on();
    this.props.socket.emit('new user', { user: this.props.params.username });
    this.props.socket.on('initialize data', (data) =>  this._initializeData(data) );
    this.props.socket.on('update users', (data) =>  this._updateUsers(data) );
    this.props.socket.on('update history', (data) =>  this._updateHistory(data) );
  }

  _initializeData = (data) => {
    this.setState({
      history: data.history,
      activeUsers: data.activeUsers,
      userId: data.userId
    });
  }

  _updateHistory = (data) => {
    this.setState({
      history: this.state.history.concat(data.newMessage)
    })
  }

  _updateUsers = (data) => {
    this.setState({
      activeUsers: this.state.activeUsers.concat(data.newUser)
    });
  }

  updateMessage = (text) => {
    this.setState({
      message: text
    });
  }

  sendMessage = () => {
    if(!this.state.message)
      return;

    const d = new Date();
    const day = d.getDate();
    const month = monthName[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    this.props.socket.emit('new message', {
      user: this.props.params.username,
      text: this.state.message,
      date: `${day} ${month} ${year} à ${hours}h${minutes}`
    });
    this.setState({
      message: ''
    });
    event.preventDefault();
  }

  toggleSideBar = () => {
    this.setState({
      sideBarState: this.state.sideBarState === "apparent" ? "hidden" : "apparent"
    });
  }

  render() {
    return(
      <main className="page-chat">
        <SideBarContainer users={this.state.activeUsers} toggleSideBar={this.toggleSideBar} sideBarState={this.state.sideBarState}/>
        <TopBarContainer username={this.props.params.username.replace(/-/g," ")} toggleSideBar={this.toggleSideBar} />
        <ChatBoxContainer messages={this.state.history} userId={this.state.userId}/>
    		<SendBoxContainer message={this.state.message} updateMessage={this.updateMessage} sendMessage={this.sendMessage}/>
    	</main>
    );
  }
}

export default socketConnect(Chatroom);
