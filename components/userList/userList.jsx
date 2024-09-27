import React from "react";
import { Button, Divider, List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";
import "./userList.css";

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: window.models.userListModel(), // List of users
    };
  }

  render() {
    return (
      <List>
        {this.state.users.map((user) => (
          <ListItem key={user._id}>
            <Button
              component={Link}
              to={`/users/${user._id}`}
              onClick={() => this.props.userHandler(user._id)}
            >
              {user.first_name} {user.last_name}
            </Button>
            <Divider />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default UserList;
