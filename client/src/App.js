import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
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
      id: (cookies.get('id') ? Number(cookies.get('id')) : ''),
      token: cookies.get('token') || ''
    };
  }

  componentDidMount() {
    const { cookies } = this.props;

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

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.loadStateFromCookies();
    }
  }


  loadStateFromCookies() {
    const { cookies } = this.props;
    this.setState({
      id: (cookies.get('id') ? Number(cookies.get('id')) : ''),
      token: cookies.get('token') || ''
    })
  }

  render() {
    const { id, token } = this.state;

    if (this.state.id === '' || this.state.token === '') {
      if (this.props.location.pathname !== '/login') {
        if (!(this.props.location.state && this.props.location.state.id && this.props.location.state.token)) {
          this.props.history.push('/login');
        }
      }
    }

    return (
      <div className="App">
        <Route exact path='/' render={() => {
          if (id !== '' && token !== '') {
            return <HomePage id={id} token={token} />
          }
        }} />
        <Route exact path='/login' render={() => (
          <LoginPage />
        )} />
      </div>
    );
  }
}

export default withCookies(withRouter(App));
