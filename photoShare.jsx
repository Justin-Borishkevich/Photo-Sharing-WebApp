import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import "./styles/main.css";
import TopBar from "./components/topBar/TopBar";
import UserDetail from "./components/userDetail/userDetail";
import UserList from "./components/userList/userList";
import UserPhotos from "./components/userPhotos/userPhotos";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "0",
      displayType: null,
    };
    this.userHandler = this.userHandler.bind(this);
    this.setDisplayType = this.setDisplayType.bind(this);
  }

  userHandler(user) {
    this.setState({ currentUser: user });
  }

  setDisplayType(displayType) {
    if (this.state.displayType !== displayType) {
      this.setState({ displayType: displayType });
    }
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar
                currentUser={this.state.currentUser}
                displayType={this.state.displayType}
              />
            </Grid>
            <div className="main-topbar-buffer" />

            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList userHandler={this.userHandler} />
              </Paper>
            </Grid>

            <Grid item sm={9}>
              <Paper className="main-grid-item">
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
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
