import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { socketConnect } from 'socket.io-react';
import users from './images/users.svg';
import arrow from './images/arrow-left.svg';
import enveloppe from './images/envelope.svg';

const TopBarContainer = ({username, toggleSideBar, disconnectUser, usersCount}) => {
  return (
    <header>
      <img src={arrow} alt="arrow left back" onClick={disconnectUser}/>
      <p>{username}</p>
      <div><img src={users} alt="users" onClick={toggleSideBar}/></div>
      <span className="badge">{usersCount}</span>
    </header>
  );
};
TopBarContainer.propTypes = {
  username: React.PropTypes.string.isRequired,
  toggleSideBar: React.PropTypes.func.isRequired,
  disconnectUser: React.PropTypes.func.isRequired,
  usersCount: React.PropTypes.number.isRequired
}

const SideBarContainer = ({sideBarState, toggleSideBar, users}) => {
  return (
    <div className={`sidenav ${sideBarState}`}>
      <a className="closebtn" onClick={toggleSideBar}>&times;</a>
      {
        users.map((user) => {
          return (
            <li key={user.id}>{user.name}</li>
          );
        })
      }
    </div>
  );
};
SideBarContainer.propTypes = {
  sideBarState: React.PropTypes.oneOf(['apparent', 'hidden']).isRequired,
  toggleSideBar: React.PropTypes.func.isRequired,
  users: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    id: React.PropTypes.number
  })).isRequired
};

const SendBoxContainer = ({message, updateMessage, sendMessage}) => {
  return (
    <section className="write-message">
      <SendBoxText message={message} updateMessage={updateMessage} />
      <SendBoxSend sendMessage={sendMessage}/>
    </section>
  );
};
SendBoxContainer.propTypes = {
  message: React.PropTypes.string.isRequired,
  updateMessage: React.PropTypes.func.isRequired,
  sendMessage: React.PropTypes.func.isRequired
};

const SendBoxText = ({message, updateMessage, sendMessage}) => {
  const handleChange = (event) => updateMessage(event.target.value);
  return (
    <textarea rows="3" placeholder="Ecrire le message..." value={message} onChange={handleChange}></textarea>
  );
};
SendBoxText.propTypes = {
  message: React.PropTypes.string.isRequired,
  updateMessage: React.PropTypes.func.isRequired
};

const SendBoxSend = ({sendMessage}) => <button onClick={sendMessage}><img src={enveloppe} alt="Icone envelope"/></button>;
SendBoxSend.propTypes = { sendMessage: React.PropTypes.func.isRequired };

class ChatBoxContainer extends Component {
  static propTypes = {
    userId: React.PropTypes.number,
    messages: React.PropTypes.arrayOf(React.PropTypes.shape({
      userId: React.PropTypes.number,
      id: React.PropTypes.number,
      name: React.PropTypes.string,
      date: React.PropTypes.string,
      text: React.PropTypes.string
    }))
  }

  shouldComponentUpdate = (nextProps) => nextProps.messages !== this.props.messages;

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.messages === this.props.messages)
      return;
    const node = ReactDOM.findDOMNode(this);
    node.scrollTop = node.scrollHeight;
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

    this.props.socket.emit('new message', {
      user: this.formatName(this.props.params.username),
      text: this.state.message,
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
