import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Grid, Typography, Paper } from "@mui/material";
import "./styles/main.css";

// Import necessary components
import TopBar from "./components/topBar/TopBar";
import UserDetail from "./components/userDetail/userDetail";
import UserList from "./components/userList/userList";
import UserPhotos from "./components/userPhotos/userPhotos";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "0", // The ID of the currently selected user
      displayType: null, // The type of content being displayed (0 = user details, 1 = user photos)
    };
    this.userHandler = this.userHandler.bind(this); // Binds userHandler method
    this.setDisplayType = this.setDisplayType.bind(this); // Binds setDisplayType method
  }

  userHandler(user) {
    // Handles setting the user by ID
    this.setState({ currentUser: user });
  }

  setDisplayType(displayType) {
    // Handles setting the display type (user details or photos)
    // Check if the displayType has changed before setting state
    if (this.state.displayType !== displayType) {
      this.setState({ displayType: displayType });
    }
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            {/* TopBar */}
            <Grid item xs={12}>
              <TopBar
                currentUser={this.state.currentUser}
                displayType={this.state.displayType}
              />
            </Grid>

            {/* Buffer space below TopBar */}
            <div className="main-topbar-buffer" />

            {/* Sidebar UserList */}
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList userHandler={this.userHandler} />
              </Paper>
            </Grid>

            {/* Main content area */}
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Switch>
                  {/* User Details Route */}
                  <Route
                    path="/users/:userId"
                    render={(props) => (
                      <UserDetail
                        {...props}
                        setDisplayType={() => this.setDisplayType(0)}
                      />
                    )}
                  />

                  {/* User Photos Route */}
                  <Route
                    path="/photos/:userId"
                    render={(props) => (
                      <UserPhotos
                        {...props}
                        setDisplayType={() => this.setDisplayType(1)}
                      />
                    )}
                  />

                  {/* User List Route - Not typically used but kept for deep linking */}
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
