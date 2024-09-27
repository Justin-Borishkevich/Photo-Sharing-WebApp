import React from 'react';
import {
  Button,
  Divider,
  List,
  ListItem,
}
from '@mui/material';
import './userList.css';

/**
 * Define UserList, a React component of project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: window.models.userListModel(), //List of users
    };
    this.userChanger = event => this.handleUser(event); //Handler
  }

  handleUser(event) {
    this.props.userHandler(event.target.title);  //Uses the title of the button instead of anything else as the title is the only thing that would work.
  }

//This render has a map function that maps the users in the state to a list of buttons that can be clicked on.
//It can handle an "infinite" amount of users.
//It sucks real hard and I hated writing it.
  render() {
    return (
      <div>
      {this.state.users.map((names, index) => (
        <><ListItem key={index}><Button onClick={this.userChanger} title={names._id} >{names.first_name} {names.last_name}</Button></ListItem><Divider /></>
      ))}
        <List component="nav">
        </List>
      </div>
    );
  }
}

export default UserList;
