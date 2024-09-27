import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import "./TopBar.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: window.models.userListModel(), // List of users
    };
  }

  // This function takes the current user ID and returns the name of the user
  userIDtoName() {
    const id = this.props.currentUser;
    const user = this.state.users.find((u) => u._id === id);
    return user
      ? `${user.first_name} ${user.last_name}`
      : "Please Select a User";
  }

  // This function returns the appropriate text based on the display context
  displayContextToText() {
    const userName = this.userIDtoName();
    if (this.props.displayType === 0) {
      return `User Details of ${userName}`;
    }
    if (this.props.displayType === 1) {
      return `Photos of ${userName}`;
    }
    return "Please Select a User";
  }

  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className="topbar-appBar">
          <Toolbar>
            <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
              Current User: {this.userIDtoName()}
            </Typography>
            <Typography variant="h5" color="inherit">
              {this.displayContextToText()}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

export default TopBar;
