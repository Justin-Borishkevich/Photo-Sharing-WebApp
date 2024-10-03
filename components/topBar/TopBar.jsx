import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";
import "./TopBar.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      version: "",
    };
  }

  componentDidMount() {
    fetchModel("/user/list").then((response) => {
      this.setState({ users: response.data });
    });

    fetchModel("/test/info").then((response) => {
      this.setState({ version: response.data.__v });
    });
  }

  userIDtoName() {
    const id = this.props.currentUser;
    const user = this.state.users.find((u) => u._id === id);
    return user ? `${user.first_name} ${user.last_name}` : "Please Select a User";
  }

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
              Current User: Group 8
            </Typography>
            <Typography variant="h5" color="inherit">
              {this.displayContextToText()}
            </Typography>
            <Typography variant="caption" color="inherit" sx={{ marginLeft: 2 }}>
              Version: {this.state.version}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

export default TopBar;
