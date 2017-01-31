import React, { Component } from 'react';

class TopBarContainer extends Component {
  render() {
    return(
      <header>
        {this.props.username}
        <div></div>
      </header>
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
              <div className={this.checkUsername(message.name)} key={message.key}>
                <p>{message.name} le {message.date}</p>
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
      <button onClick={this.props.sendMessage} >Ok</button>
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

class Chatroom extends Component {
  constructor() {
    super();
    this.state = {
      history: [
        {name: "Jonathan", text: "Message de Jon", date: "13 janvier 2017 à 16h28", key: 1},
        {name: "Thomas", text: "Message de Thomas", date: "14 janvier 2017 à 18h00", key: 2},
        {name: "Kevin", text: "Message de Kevin", date: "14 janvier 2017 à 18h00", key: 3},
        {name: "Jonathan", text: "Message de Jon 2", date: "14 janvier 2017 à 18h00", key: 4},
        {name: "Mario", text: "It's a me, Mario !", date: "14 janvier 2017 à 18h00", key: 5},
        {name: "Booba", text: "OKLM 92i", date: "14 janvier 2017 à 18h00", key: 6}
      ],
      activeUsers: [/*"Jonathan", "Thomas"*/],
      message: ""
    };
  }

  updateMessage = (text) => {
    this.setState({
      message: text
    });
  }

  sendMessage = () => {
    if(this.state.message)
      /**** SEND TO SERVER ****/
    event.preventDefault();
  }


  render() {
    return(
      <main className="page-chat">
        <TopBarContainer username={this.props.params.username.replace(/-/g," ")} />
        <ChatBoxContainer messages={this.state.history} username={this.props.params.username}/>
    		<SendBoxContainer message={this.state.message} updateMessage={this.updateMessage} sendMessage={this.sendMessage}/>
    	</main>
    );
  }
}

export default Chatroom;
