import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { getUserId, getUserInfo } from '../../services/minervaApi.js';

import './styles.css';

class LoginPage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    const { cookies } = props;
    super(props);

    this.state = {
      token: '',
      redirectHome: cookies.get('id') || cookies.get('token')   // have id or token in cookie, redirect to home
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const token = this.state.token;

    getUserId(token).then((data) => {
      if (data.user) {
        getUserInfo(token, data['user']).then((data) => {
          const { cookies } = this.props;
          if (window.confirm(`Are you ${data['last-name']} ${data['first-name']}?`)) {
            cookies.set('id', data.id);
            cookies.set('token', token);


            // redirect to home page
            this.props.history.push({
              pathname: '/',
              state: {
                id: data.id,
                token: token
              }
            });
          }
        })
      }
      else {
        window.alert("Invalid token!");
      }
    });
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

export default withCookies(withRouter(LoginPage));
