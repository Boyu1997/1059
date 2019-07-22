import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import LoginPage from './pages/Login/index.js'

import './App.css';



class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const { cookies } = props;

    this.state = {
      token: cookies.get('token') || 'none'
    };
  }

  redirectLogin = () => {
    if (this.state.token === 'none') {
      return <Redirect to='/login' />
    }
  }

  render() {
    return (
      <div className="App">
        {this.redirectLogin()}
        <Route exact path='/' render={() => (
          <h1>1059</h1>
        )} />
        <Route exact path='/login' render={() => (
          <LoginPage />
        )} />
      </div>
    );
  }
}

export default withCookies(App);
