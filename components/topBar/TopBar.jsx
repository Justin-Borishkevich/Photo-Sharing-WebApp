import React from 'react';
import {
  AppBar, Toolbar, Typography,Box
} from '@mui/material';
import './TopBar.css';
/**
 * Define TopBar, a React componment of project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Both of these numbers are passed from photoShare.jsx and took me sooooo long to figure out.
      //If I could kick these number in the elbow I would.
      currentUser: props.currentUser, //UserID
      displayContext: props?.displayContext, //Type of details being displayed. Currently returns a lint error, will be fixed once userDetail is implemented.
      users: window.models.userListModel(), //List of users
  
    };
    //Bind the functions so that they dont cause a fuss.
    this.userIDtoName = this.userIDtoName.bind(this); 
    this.displayContextToText = this.displayContextToText.bind(this);

  }
  //This function takes the current user ID and returns the name of the user. 
  //If there is no ID (represented by 0) it will return "Please Select a User"
  //else it will return "No User"
  userIDtoName() {
    let id = this.props.currentUser;
    for (let i = 0; i < this.state.users.length; i++) {
      if (this.state.users[i]._id === id) {
        return this.state.users[i].first_name + " " + this.state.users[i].last_name;
      }}
    if (this.state.currentUser === "0") {
      return "Please Select a User";}
    return "No User";
  }
  //This function takes the displayContext and returns the text that should be displayed in the top bar.
  //If the displayType is 0 it will return "User Details of [User Name]"
  //If the displayType is 1 it will return "User Photos of [User Name]"
  //If the displayType is anything else it will return "Please Select a User"
  displayContextToText() {
    let id = this.props.displayContext;
    let userName = "";
    for (let i = 0; i < this.state.users.length; i++) {
      if (this.state.users[i]._id === id) {
        userName= this.state.users[i].first_name + " " + this.state.users[i].last_name;
      }}
    let displayType = this.props.displayType;
    if (displayType === 0) {
      return "User Details of "+ userName;
    }
    if (displayType === 1) {
      return "User Photos of "+ userName;
    }
    else {
      return "Please Select a User";
    }
  }

  render() {
    return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className="topbar-appBar">
        <Toolbar>
          <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
              Current User: &ldquo; {this.userIDtoName()} &rdquo;
          </Typography>
          <Typography variant="h5" color="inherit" >
              &ldquo; {this.displayContextToText()} &rdquo;
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    );
  }
}

export default TopBar;
