import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@mui/material';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser : "0", //This is where the evil begins.
    };
    this.userHandler = this.userHandler.bind(this); //Makes it so you can acsess userHandler through this.
  }

  userHandler(user) { //Handles the setting on the user by ID.
    this.setState({currentUser:user});
  }
//Data is passed from userList.jsx to photoShare.jsx through the userHandler function.
//This data is then passed to topBar.jsx through the currentUser prop.
//It was real hard to figure out how to do this.

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar currentUser={this.state.currentUser}/> 
        </Grid>
        <div className="main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList userHandler={this.userHandler}/>
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Switch>
            <Route exact path="/"
                render={() => (
                <Typography variant="body1">
                  Welcome to your photosharing app! This <a href="https://mui.com/components/paper/">Paper</a> component
                  displays the main content of the application. The {"sm={9}"} prop in
                  the <a href="https://mui.com/components/grid/">Grid</a> item component makes it responsively
                  display 9/12 of the window. The Switch component enables us to conditionally render different
                  components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                  so you should delete this Route component once you get started.
                </Typography>
                )}
              />
              <Route path="/users/:userId"
                render={ props => <UserDetail {...props} /> }
              />
              <Route path="/photos/:userId"
                render ={ props => <UserPhotos {...props} /> }
              />
              <Route path="/users" component={UserList}  />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
