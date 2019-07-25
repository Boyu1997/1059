import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { getUserId } from './services/minervaApi.js';

import LoginPage from './pages/Login/index.js'
import HomePage from './pages/Home/index.js'

import './App.css';



class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    const { cookies } = props;
    super(props);

    this.state = {
      id: Number(cookies.get('id')) || '',
      token: cookies.get('token') || ''
    };


    // check token and user id, if invalid, remove cookies and redirect to login
    if (this.state.id !== '' && this.state.token !== '') {
      getUserId(this.state.token).then((data) => {
        if (!data.user || data.user !== this.state.id) {
          cookies.remove('id');
          cookies.remove('token');
          this.setState({
            id: '',
            token: ''
          });
        }
      });
    }
  }

  redirectLogin = () => {
    if (this.state.id === '' || this.state.token === '') {
      return <Redirect to='/login' />
    }
  }

  render() {
    const { id, token } = this.state;
    return (
      <div className="App">
        {this.redirectLogin()}
        <Route exact path='/' render={() => (
          <HomePage id={id} token={token} />
        )} />
        <Route exact path='/login' render={() => (
          <LoginPage />
        )} />
      </div>
    );
  }
}

export default withCookies(App);
