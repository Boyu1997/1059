import React, { Component } from 'react';

import * as LoginAPI from './api.js';

import './styles.css';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userName: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    LoginAPI.getUserId(this.state.token).then((data) => {
      if (data.user) {
        LoginAPI.getUserInfo(data['user'], this.state.token).then((data) => {
          this.setState({ userName: `${data['last-name']} ${data['first-name']}` });
        })
      }
      else {
        this.setState({ userName: 'undefined' });
      }
    })

  }

  render() {
    return (
      <div className="Login-Page">
        <form onSubmit={this.handleSubmit}>
          <label>
            Token:
            <input type="text" name="token" value={this.state.token} onChange={this.handleInputChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default LoginPage;
