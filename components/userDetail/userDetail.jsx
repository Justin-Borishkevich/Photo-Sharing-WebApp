import React from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link
import "./userDetail.css";

class UserDetail extends React.Component {
  componentDidMount() {
    this.props.setDisplayType(); // Set display type to 0 (User Detail view)
  }

  render() {
    const userId = this.props.match.params.userId;
    const user = window.models.userModel(userId);

    if (!user) {
      return <Typography variant="body1">User not found.</Typography>;
    }

    return (
      <div>
        <Typography variant="h4">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body1">Location: {user.location}</Typography>
        <Typography variant="body1">Description: {user.description}</Typography>
        <Typography variant="body1">Occupation: {user.occupation}</Typography>
        {/* Use the imported Link */}
        <Button variant="contained" component={Link} to={`/photos/${userId}`}>
          View Photos
        </Button>
      </div>
    );
  }
}

export default UserDetail;
