import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import axios from "axios";
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
      currentUser: null,
      displayType: null,
    };
    this.userHandler = this.userHandler.bind(this);
    this.setDisplayType = this.setDisplayType.bind(this);
  }

  componentDidMount() {
    this.checkSession();
  }

  async checkSession() {
    try {
      const response = await axios.get("/user/current");
      this.setState({ currentUser: response.data.user });
    } catch {
      this.setState({ currentUser: null });
    }
  }

  userHandler(user) {
    this.setState({ currentUser: user });
  }

  setDisplayType(displayType) {
    if (this.state.displayType !== displayType) {
      this.setState({ displayType: displayType });
    }
  }

  // Clear currentUser after logout
  handleLogout = () => {
    this.setState({ currentUser: null });
  };

  render() {
    const { currentUser, displayType } = this.state;

    return (
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar
                user={currentUser}
                onLogout={this.handleLogout} // This will clear currentUser on logout
                displayType={displayType}
              />
            </Grid>
            <div className="main-topbar-buffer" />

            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {currentUser ? (
                  <UserList userHandler={this.userHandler} />
                ) : (
                  <h2>Please log in to see the user list.</h2>
                )}
              </Paper>
            </Grid>

            <Grid item sm={9}>
              <Paper className="main-grid-item">
                {currentUser ? (
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
                  <LoginRegister onLogin={this.userHandler} />
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

