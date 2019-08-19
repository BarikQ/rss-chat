import React from 'react';

const socketURL = 'ws://st-chat.shas.tel';
const secondSocketUrl = 'wss://wssproxy.herokuapp.com/';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: this.props.user,
      message: '',
      isOpen: false,
      notify: false
    }
  }

  componentDidMount() {
    this.initSocket();
    const chatContainer = document.querySelector('#chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
    navigator.serviceWorker.register('Chat.js');
    Notification.requestPermission((result) => {
      if (result === 'granted') {
        this.setState({ notify: true });
      }
    });

    window.addEventListener('resize', (event) => {
      const chatContainer = document.querySelector('#chatContainer');

      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }

  notify = (dataDefault) => {
    if(document.hidden) {
      dataDefault.forEach((elem, index) => {
        if (index < 5 && elem.from !== this.props.user) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(
              `${elem.from}`, {
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                body: elem.message,
                tag: 'new-message'
              }
            )
          });
        }
      });
    }
  }

  initSocket = () => {
    const socket = new WebSocket(secondSocketUrl);

    this.setState({ isOpen: true });

    const connect = document.querySelector('#connection');

    socket.onopen = (event) => {
      connect.innerHTML = 'Connected';
      connect.style.color = 'green';
    }

    socket.onmessage = (e) => {
      e.data.slice(0, 200);

      const dataDefault = JSON.parse(e.data);

      if (this.state.notify) {
        this.notify(dataDefault);

      } else Notification.requestPermission((permission) => {
        if (this.state.notify) {
          this.notify(dataDefault);
        }
      })

      const data = dataDefault.reverse();

      const chat = document.querySelector('#messages')

      data.forEach((elem, index) => {
        let itemClass = 'messageContainer';

        if (elem.from === this.props.user) {
          itemClass += ' user-message';
        }

        chat.insertAdjacentHTML('beforeend', 
        `
          <li class="${itemClass}">
            <span class="nickname">${elem.from}</span>
            <span class="message">${elem.message}</span>
          </li>
        `);
      });

      const chatContainer = document.querySelector('#chatContainer');
      const chatHeight = chatContainer.scrollHeight - chatContainer.clientHeight;

      if (data.length > 1 || chatHeight - chatContainer.scrollTop < 150) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }

      this.setState({ messages: e.data });
    }

    socket.onclose = (event) => {
      this.setState({ isOpen: false });
      if (event.code == 1005) {
        this.initSocket();
      }
      if (event.wasClean) {
        this.initSocket();
      } else {
        connect.innerHTML = `[error]: ${event.code}. Reconnetion attempt...`;
        connect.style.color = 'red';

        this.initSocket();
      }
    };
    
    socket.onerror = (error) => {
      this.setState({ isOpen: false });

      connect.innerHTML = `[error]: ${error.message}. Reconnetion attempt...`;
      connect.style.color = 'red';

      this.initSocket();
    };

    this.setState( {socket} );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const inputForm = document.querySelector('#message');
    const { socket } = this.state;

    if (this.state.message === ' ' || this.state.message === '') {
      inputForm.value = '';
      return;
    }

    socket.send(JSON.stringify({
      from: this.state.user,
      message: this.state.message
    }));
    
    inputForm.value = '';
    this.setState({ message: '' });
  }

  handleChange = (e) => {
    this.setState({message: e.target.value});
  }

  getMessage = (data) => {
    data = JSON.parse(data);

    const chat = document.querySelector('#messages');
    chat.insertAdjacentHTML('beforeend', 
    `
      <li className="messageContainer">
        <span className="nickname">${data[0].from}</span>
        <span className="message">${data[0].message}</span>
      </li>
    `);
    return ;
  }

  render() {
    const { message } = this.state.message;

    return (
      <>
      <div className="chatContainer" id="chatContainer">
        <ul className="messages" id="messages" />
      </div>
      <form onSubmit = {this.handleSubmit} className="chatForm">
        <input 
          ref={(input) => { this.textInput = input }}
          type="text"
          id="message"
          value={message}
          onChange={this.handleChange}
          placeholder="Type here..."
          autoFocus
          autoComplete="off">
        </input>
        <div className="buttonContainer">
          <input 
            type="button" 
            className="sendButton" 
            onClick={this.handleSubmit}
            placeholder="send"
            />
        </div>
      </form>
      </>
    )
  }
}