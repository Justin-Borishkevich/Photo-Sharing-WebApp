import React from "react";
import { Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import "./userPhotos.css";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null, // Initialize state to store photos
    };
  }

  componentDidMount() {
    this.props.setDisplayType(); // Set display type to 1 (User Photos view)

    const userId = this.props.match.params.userId;
    const photos = window.models.photoOfUserModel(userId);

    // Debugging: Check userId and photos in componentDidMount
    console.log("User ID (componentDidMount):", userId);
    console.log("Photos for user (componentDidMount):", photos);

    // Update state with the photos array
    this.setState({ photos });
  }

  render() {
    const { photos } = this.state;

    // If photos are not loaded yet, render a loading message
    if (!photos) {
      return <Typography variant="body1">Loading photos...</Typography>;
    }

    // If photos is an empty array, show no photos message
    if (photos.length === 0) {
      return (
        <Typography variant="body1">
          No photos available for this user.
        </Typography>
      );
    }

    // Render photos once they are loaded and not empty
    return (
      <div>
        {photos.map((photo) => (
          <div key={photo._id} className="photo-container">
            <Typography variant="h6">{photo.date_time}</Typography>
            <img src={`/images/${photo.file_name}`} alt="User's Photo" />
            <div className="comments">
              {photo.comments &&
                photo.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <Typography variant="body2">
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                      : {comment.comment}
                    </Typography>
                    <Typography variant="caption">
                      {comment.date_time}
                    </Typography>
                  </div>
                ))}
            </div>
            <Divider />
          </div>
        ))}
      </div>
    );
  }
}

export default UserPhotos;
