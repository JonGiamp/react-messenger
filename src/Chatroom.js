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
  checkUsername(name) {
    return (name === this.props.username) ? "mine" : "other";
  }

  render() {
    return (
      <section className="content">
        {/* Generate message list */}
        {
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
  render() {
    return (
      <textarea rows="3" placeholder="Ecrire le message..." ></textarea>
    );
  }
}

class SendBoxSend extends Component {
  render() {
    return (
      <button type="submit">Ok</button>
    );
  }
}

class SendBoxContainer extends Component {
  render() {
    return (
      <section className="write-message">
        <SendBoxText />
        <SendBoxSend />
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

  updateMessage(message) {
    this.setState = {
      message: message
    };
    console.log(this.state.message);
  }

  render() {
    return(
      <main className="page-chat">
        <TopBarContainer username={this.props.params.username} />
        <ChatBoxContainer messages={this.state.history} username={this.props.params.username}/>
    		<SendBoxContainer onChange={this.updateMessage}/>
    	</main>
    );
  }
}

export default Chatroom;
