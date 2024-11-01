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

  displayContextToText() {
    const selectedUser = this.props.selectedUser;
    const userName = selectedUser
      ? `${selectedUser.first_name} ${selectedUser.last_name}`
      : "Please Select a User";
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
          <Toolbar className="topbar-toolbar">
            <Box className="topbar-section-left">
              <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
                {user ? `Hi, ${user.first_name}` : "Please Login"}
              </Typography>
              {user && (
                <Button color="inherit" onClick={this.handleLogout}>
                  Logout
                </Button>
              )}
            </Box>

            <Box className="topbar-section-center">
              <input
                type="file"
                accept="image/*"
                ref={(domFileRef) => {
                  this.uploadInput = domFileRef;
                }}
                className="topbar-upload-input"
              />
              <Button
                onClick={this.handleUploadButtonClicked}
                className="topbar-upload-button"
                color="inherit"
              >
                Upload
              </Button>
            </Box>

            <Box className="topbar-section-right">
              <Typography variant="h5" color="inherit">
                {this.displayContextToText()}
              </Typography>
              <Typography variant="caption" color="inherit">
                Version: {this.state.version}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

export default TopBar;
