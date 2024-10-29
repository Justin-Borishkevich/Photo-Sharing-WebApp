import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import axios from "axios";
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
    axios.get("/user/list").then((response) => {
      this.setState({ users: response.data });
    });

    axios.get("/test/info").then((response) => {
      this.setState({ version: response.data.__v });
    });
  }

  userIDtoName() {
    const id = this.props.currentUser;
    const user = this.state.users.find((u) => u._id === id);
    return user
      ? `${user.first_name} ${user.last_name}`
      : "Please Select a User";
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

  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append("uploadedphoto", this.uploadInput.files[0]);
      axios
        .post("/images/upload", domForm)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(`POST ERR: ${err}`));
    }
  };

  handleLogout = async () => {
    try {
      await axios.post("/admin/logout");
      this.props.onLogout(); // Clear user in the parent component
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  render() {
    const { user } = this.props;
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className="topbar-appBar">
          <Toolbar>
            <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
              {user ? `Hi, ${user.first_name}` : "Please Login"}
            </Typography>
            {user && (
              <Button color="inherit" onClick={this.handleLogout}>
                Logout
              </Button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={(domFileRef) => {
                this.uploadInput = domFileRef;
              }}
            />
            <button onClick={this.handleUploadButtonClicked}>Upload</button>
            <Typography variant="h5" color="inherit">
              {this.displayContextToText()}
            </Typography>
            <Typography
              variant="caption"
              color="inherit"
              sx={{ marginLeft: 2 }}
            >
              Version: {this.state.version}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

export default TopBar;
