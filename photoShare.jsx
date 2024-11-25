import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import "./styles/main.css";
import TopBar from "./components/topBar/TopBar";
import UserDetail from "./components/userDetail/userDetail";
import UserList from "./components/userList/userList";
import UserPhotos from "./components/userPhotos/userPhotos";
import LoginRegister from "./components/loginRegister/LoginRegister";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      selectedUser: null,
      displayType: null,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.userHandler = this.userHandler.bind(this);
    this.setDisplayType = this.setDisplayType.bind(this);
  }

  // Handle login and store the logged-in user
  handleLogin(user) {
    this.setState({ loggedInUser: user });
  }

  // Handle user selection from UserList
  userHandler(user) {
    this.setState({ selectedUser: user });
  }

  setDisplayType(displayType) {
    if (this.state.displayType !== displayType) {
      this.setState({ displayType: displayType });
    }
  }

  // Clear loggedInUser after logout
  handleLogout = () => {
    this.setState({ loggedInUser: null, selectedUser: null });
  };

  render() {
    const { loggedInUser, selectedUser, displayType } = this.state;

    return (
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar
                user={loggedInUser}
                selectedUser={selectedUser}
                onLogout={this.handleLogout} // This will clear loggedInUser on logout
                displayType={displayType}
              />
            </Grid>
            <div className="main-topbar-buffer" />

            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {loggedInUser ? (
                  <UserList userHandler={this.userHandler} />
                ) : (
                  <h2>Please log in to see the user list.</h2>
                )}
              </Paper>
            </Grid>

            <Grid item sm={9}>
              <Paper className="main-grid-item">
                {loggedInUser ? (
                  <Switch>
                    <Route
                      path="/users/:userId"
                      render={(props) => (
                        <UserDetail
                          {...props}
                          setDisplayType={() => this.setDisplayType(0)}
                        />
                      )}
                    />
                    <Route
                      path="/photos/:userId"
                      render={(props) => (
                        <UserPhotos
                          {...props}
                          setDisplayType={() => this.setDisplayType(1)}
                        />
                      )}
                    />
                    <Route path="/users" component={UserList} />
                    <Redirect to="/users" />
                  </Switch>
                ) : (
                  <LoginRegister onLogin={this.handleLogin} />
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
