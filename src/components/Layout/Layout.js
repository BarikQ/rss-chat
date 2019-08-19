import React from 'react';

import LoginForm from '../Login/LoginForm';
import Chat from '../Chat/Chat';

export default class Layout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: false,
      messages: null
    };
  }

  componentDidMount() {
    if(localStorage.getItem('username')) {
      this.setState({ user: localStorage.getItem('username')});
    }
  }

  setUser = (user) => {
    this.setState({ user });
    localStorage.setItem('username', user);
  }

  render() {
    const { user } = this.state;

    return (
      <>
      <div className="connection" id="connection"></div>
      <div className="container">
        {
          user?
          <Chat user={user} />
          :
          <LoginForm setUser={this.setUser} />
        }
      </div>
      </>
    );
   }
}