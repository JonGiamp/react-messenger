import React, { Component } from 'react';
import users from './images/users.svg';
import arrow from './images/arrow-left.svg';
import enveloppe from './images/envelope.svg';
import { socketConnect } from 'socket.io-react';
import monthName from './monthName.js';

class TopBarContainer extends Component {
  propTypes: {
    username: React.PropTypes.string.isRequired,
    toggleSideBar: React.PropTypes.func.isRequired,
    disconnectUser: React.PropTypes.func.isRequired
  }
  render() {
    return(
      <header>
        <img src={arrow} alt="arrow left back" onClick={this.props.disconnectUser}/>
        <p>{this.props.username}</p>
        <div><img src={users} alt="users" onClick={this.props.toggleSideBar}/></div>
        <span className="badge">{this.props.usersCount}</span>
      </header>
    );
  }
}

class SideBarContainer extends Component {
  propTypes: {
    sideBarState: React.PropTypes.string.isRequired,
    toggleSideBar: React.PropTypes.func.isRequired
    // users: React.PropTypes.arrayOf(React.PropTypes.shape({
    //   name: React.PropTypes.string,
    //   id: React.PropTypes.number
    // }))
  }
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
  propTypes: {
    userId: React.PropTypes.number.isRequired
    // messages: React.PropTypes.arrayOf(React.PropTypes.shape({
    //   userId: React.PropTypes.number,
    //   id: React.PropTypes.number,
    //   name: React.PropTypes.string,
    //   date: React.PropTypes.string,
    //   text: React.PropTypes.string
    // }))
  }

  checkUserId = (userId) => (userId === this.props.userId) ? "mine" : "other";

  render() {
    return (
      <section className="content">
        {
          this.props.messages.map((message) => {
            return (
              <div className={this.checkUserId(message.userId)} key={message.id}>
                <p className="date">{message.user} le {message.date}</p>
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
  propTypes: {
    message: React.PropTypes.string.isRequired,
    updateMessage: React.PropTypes.func.isRequired,
    sendMessage: React.PropTypes.func.isRequired
  }

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
  propTypes: {
    message: React.PropTypes.string.isRequired,
    updateMessage: React.PropTypes.func.isRequired
  }

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
  propTypes: {
    sendMessage: React.PropTypes.func.isRequired
  }
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
      history: [ /* {name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", id: 1, userId: 3} */ ],
      activeUsers: [ /* {name: "Jonathan", userId: 0} */ ],
      message: "",
      userId: null,
      sideBarState: "hidden"
    };
  }

  componentDidMount = () => {
    // this.props.socket.on();
    this.props.socket.emit('new user', { user: this.formatName(this.props.params.username) });
    this.props.socket.on('initialize data', (data) =>  this._initializeData(data) );
    this.props.socket.on('update users', (data) =>  this._updateUsers(data) );
    this.props.socket.on('update history', (data) =>  this._updateHistory(data) );
    this.props.socket.on('slice user', (data) =>  this._sliceUser(data) );
  }

  _sliceUser = (index) => {
    this.setState({
      activeUsers: this.state.activeUsers.slice(0, index).concat(this.state.activeUsers.slice(index + 1))
    });
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

  formatName = (name) => name.replace(/-/g," ");

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
      user: this.formatName(this.props.params.username),
      text: this.state.message,
      date: `${day} ${month} ${year} à ${hours}h${minutes}`,
      userId: this.state.userId
    });
    this.setState({ message: '' });
    event.preventDefault();
  }

  disconnectUser = () => {
    this.props.socket.emit('disconnect user');
    this.props.router.push('/');
  }

  toggleSideBar = () => {
    this.setState({
      sideBarState: this.state.sideBarState === "apparent" ? "hidden" : "apparent"
    });
  }

  render() {
    return(
      <main className="page-chat">
        <SideBarContainer
          users={this.state.activeUsers}
          toggleSideBar={this.toggleSideBar}
          sideBarState={this.state.sideBarState}
        />
        <TopBarContainer
          username={this.formatName(this.props.params.username)}
          toggleSideBar={this.toggleSideBar}
          disconnectUser={this.disconnectUser}
          usersCount={this.state.activeUsers.length}
        />
        <ChatBoxContainer
          messages={this.state.history}
          userId={this.state.userId
          }/>
    		<SendBoxContainer
          message={this.state.message}
          updateMessage={this.updateMessage}
          sendMessage={this.sendMessage}
        />
    	</main>
    );
  }
}

export default socketConnect(Chatroom);
