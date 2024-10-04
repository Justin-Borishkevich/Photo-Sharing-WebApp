import React from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./userDetail.css";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.props.setDisplayType();
    const userId = this.props.match.params.userId;

    fetchModel(`/user/${userId}`).then((response) => {
      this.setState({ user: response.data });
    });
  }

  componentDidUpdate(prevProps) {
    // If the userId has changed, re-fetch the user data
    const userId = this.props.match.params.userId;

    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      fetchModel(`/user/${userId}`).then((response) => {
        this.setState({ user: response.data });
      });
    }
  }

  render() {
    const { user } = this.state;

    if (!user) {
      return <Typography variant="body1">Loading user details...</Typography>;
    }

    return (
      <div>
        <Typography variant="h4">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body1">Location: {user.location}</Typography>
        <Typography variant="body1">Description: {user.description}</Typography>
        <Typography variant="body1">Occupation: {user.occupation}</Typography>
        <Button variant="contained" component={Link} to={`/photos/${user._id}`}>
          View Photos
        </Button>
      </div>
    );
  }
}

export default UserDetail;
