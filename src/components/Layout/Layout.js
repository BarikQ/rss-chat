import React from 'react';
import io from 'socket.io-client';
import LoginForm from '../Login/LoginForm';
import ChatContainer from '../Chat/ChatContainer';
import { USER_CONNECTED, LOGOUT } from '../../Events';

const socketURL = 'http://localhost:3231';

export default class Layout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: null
    };
  }

  componentDidMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketURL);

    socket.on('connect', () => {
      console.log('connected');
    })

    this.setState( {socket} );
  }

  setUser = (user) => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  }

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState( {user: null} );
  }

  render() {
    const { title } = this.props;
    const { socket, user } = this.state;

    return (
      <div className="container">
        {
          !user?
          <LoginForm socket={socket} setUser={this.setUser} />
          :
          <ChatContainer socket={socket}  user={user} logout={this.logout} />
        }
      </div>
    );
   }
}