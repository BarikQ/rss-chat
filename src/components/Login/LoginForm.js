import React from 'react';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: ''
    };
  }

  setUser = (user, isUser) => {
    if (isUser) {
      this.props.setUser(user);
    } else {
      alert('something gone wrong');
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { nickname } = this.state;

    this.setUser(nickname, true);
    
  };

  handleChange = (e) => {
    this.setState({ nickname: e.target.value });
  };

  render() {
    const { nickname } = this.state;

    return (
      <div className="loginContainer">
        <form onSubmit = {this.handleSubmit} className="login-form">
          <label htmlFor="nickname">
            <h2>
              Choose Your nickname
            </h2>
          </label>
          <input 
            ref={(input) => { this.textInput = input }}
            type="text"
            className="login"
            id="nickname"
            value={nickname}
            onChange={this.handleChange}
            placeholder={'Your name'}
            autoFocus
          />
        </form>
      </div>
    );
  }
}