import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import axios from "axios"; // Replace fetchModel import
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
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      axios.post('/images/upload', domForm)
        .then((res) => {
          console.log(res);
        })
        .catch(err => console.log(`POST ERR: ${err}`));
    }
  }

  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className="topbar-appBar">
          <Toolbar>
            <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
              Current User: Group 8
            </Typography>
            <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
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
