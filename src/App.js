import React, { Component } from 'react';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

import './App.css';
import { Header, Footer } from './components/Layouts';
import Region from './components/Region';
import Agents from './components/Agents';
import Owners from './components/Owners';
import Login from './components/Login';
import Properties from './components/Properties';
import Representatives from './components/Representatives';
import BuildingCommunity from './components/BuildingCommunity';
import * as firebaseClient from 'firebase';
import { firebaseConfig } from './config';
import actions from './actions';
import { USER_TYPES } from './globals';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff6600',
      // main: '#81c343',
      // light: '#b4f673',
      // dark: '#4f9209',
      contrastText: '#fff',
    },
    secondary: {
      main: '#0d47a1',
      // main: '#035e31',
      // light: '#3f8c5b',
      // dark: '#003309',
      contrastText: '#fff',
    },
    typography: {
      useNextVariants: true,
    },
  },
});

const baseUrl = process.env.PUBLIC_URL;
const Logo = <img src={`${baseUrl}/Logo.png`} style={{alignSelf: 'center', maxWidth: 70}} />;


class App extends Component {
  constructor(props) {
    super(props);
    this.firebase = firebaseClient.initializeApp(firebaseConfig);
    this.firestore = this.firebase.firestore();
    this.auth = this.firebase.auth();
    this.actions = actions;
    this.actions.init(this.firebase);

    let loginFor = USER_TYPES.AGENT;
    // let loginFor = USER_TYPES.ADMIN;

    if(/^agent\..*/.test(window.location.hostname)) {
      loginFor = 'agent';
    } else if(/^admin\..*/.test(window.location.hostname)) {
      loginFor = 'admin';
    }

    this.state = {
      region: 'UAE',
      user: null,
      currentLogin: {
        type: loginFor,
        inProgress: false
      },
      errorMessage: ""
    };

    this.auth.onAuthStateChanged((user, error) => {
      if(error) {
        console.error('Auth failed', error);
        return this.setState({
          user: null
        });
      }

      if(user == null) {
        console.log('No user has logged in yet');
        return;
      }

      console.log('Found logged in user.');
      const loggedInUserType = this.state.currentLogin.type;
      this.actions.validateFirebaseUser(user, loggedInUserType).then(userData => {
        console.log("Validate user")
        this.setState({
          user: userData,
          currentLogin: {
            ...this.state.currentLogin,
            inProgress: false,
          }
        });
      }).catch((error) => {
        console.log('Error validating: ', error);
        this.auth.signOut();
      });
    });
  }

  onLogout = () => {
    this.auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  };

  onLoginSubmit = type => (email, password) => {
    this.setState({
      currentLogin: {
        type,
        inProgress: true
      }
    }, () => {
      if(email && password) {
        this.auth.signInWithEmailAndPassword(email, password).then((res) => {
          let collectionName;
          if (this.state.currentLogin.type === "admin")
            collectionName = "admin";
          else
            collectionName = "agents";

          this.setState({
            errorMessage: ""
          }, () => {
            //Update Last Login Time
              this.actions.lastLoginTime(res.user.uid, res.user.metadata.lastSignInTime, collectionName).catch((error) => {
                console.log('Error lastsigin time: ', error);
              });
          });
        })
        .catch((error) => {
          this.setState({
            errorMessage: error.message
          });
          console.log('Login failed', error);
        });
      }
    });
  };
  sendResetEmailLink = (email) => {
    this.auth.sendPasswordResetEmail(email)
      .then(function () {
        alert("Please check your email to reset your password");
        // Password reset email sent.
      })
      .catch(function (error) {
        console.log("Error came",error)
        // Error occurred. Inspect error.code.
      });
  }

  render() {
    const loginFor = this.state.currentLogin.type;

    if(!this.state.user) {
      return (
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
            <HashRouter >
                <Route>
                  <React.Fragment>
                    <Header page_title={`${loginFor.toUpperCase()} Login`} baseUrl={baseUrl} onLogout={this.onLogout} user={null}/>
                    <Login logo={Logo} onLogin={this.onLoginSubmit(loginFor)} auth={this.auth} baseUrl={baseUrl} errorMessage={this.state.errorMessage} sendResetEmailLink={this.sendResetEmailLink}/>
                  </React.Fragment>
                </Route>
            </HashRouter>
            </div>
          </MuiThemeProvider>
      )
    }

    const { user } = this.state;

    const commonDrillProps = {
      user: this.state.user,
      actions
    };

    return (
      <HashRouter >
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            <Route exact path={baseUrl + "/"} render={props => (
              <React.Fragment>
                <Header page_title="Dashboard" baseUrl={baseUrl} onLogout={this.onLogout} user={user}/>
                { this.state.user.type !== USER_TYPES.ADMIN && ( <Region onClose={(e, value) => this.setState({ region: value })}/> )}
              </React.Fragment>
            )} />
            <Route path={baseUrl + "/users"} render={props => (
              <React.Fragment>
                <Header page_title="Manage Users" baseUrl={baseUrl} onLogout={this.onLogout} user={user} />
                <Agents {...commonDrillProps}/>
              </React.Fragment>
            )} />
            <Route path={baseUrl + "/owners"} render={props => (
              <React.Fragment>
                <Header page_title="Manage Owners" baseUrl={baseUrl} onLogout={this.onLogout} user={user} />
                <Owners {...commonDrillProps}/>
              </React.Fragment>
            )} />
            <Route path={baseUrl + "/properties"} render={props => (
                <React.Fragment>
                  <Header page_title="Manage Properties" baseUrl={baseUrl} onLogout={this.onLogout} user={user} />
                  <Properties {...commonDrillProps}/>
                </React.Fragment>
            )} />
            <Route path={baseUrl + "/representatives"} render={props => (
                <React.Fragment>
                  <Header page_title="Manage Representatives" baseUrl={baseUrl} onLogout={this.onLogout} user={user} />
                  <Representatives {...commonDrillProps}/>
                </React.Fragment>
            )} />
            <Route path={baseUrl + "/building-community"} render={props => (
                <React.Fragment>
                  <Header page_title="Manage Building/Community" baseUrl={baseUrl} onLogout={this.onLogout} user={user} />
                <BuildingCommunity {...commonDrillProps}/>
                </React.Fragment>
            )} />
            <Footer />
          </div>
        </MuiThemeProvider>
      </HashRouter>
    );
  }
}

export default App;
