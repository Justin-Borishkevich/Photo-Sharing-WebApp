import React from "react";
import { Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./userPhotos.css";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
    };
  }

  async componentDidMount() {
    this.props.setDisplayType();
    const userId = this.props.match.params.userId;

    try {
      // Step 1: Fetch the photos of the user
      const photoResponse = await axios.get(`/photosOfUser/${userId}`);
      const photos = photoResponse.data;

      // Step 2: Fetch user details for each comment's user._id
      const photosWithUserDetails = await Promise.all(
        photos.map(async (photo) => {
          const commentsWithUsers = await Promise.all(
            photo.comments.map(async (comment) => {
              // Log the comment's user._id to check if it's undefined
              console.log(
                "Fetching user for comment with user._id:",
                comment.user._id
              );

              if (comment.user._id) {
                try {
                  const userResponse = await axios.get(
                    `/user/${comment.user._id}`
                  );
                  const user = userResponse.data;

                  // Attach the fetched user details to the comment
                  return {
                    ...comment,
                    user: {
                      _id: user._id,
                      first_name: user.first_name,
                      last_name: user.last_name,
                    },
                  };
                } catch (error) {
                  console.error(
                    `Error fetching user with ID ${comment.user._id}:`,
                    error
                  );
                  return comment; // Return the comment as-is if there's an error fetching the user
                }
              } else {
                console.error("User ID is undefined for comment:", comment);
                return comment; // Skip fetching if user._id is undefined
              }
            })
          );

          // Attach the populated comments to the photo
          return {
            ...photo,
            comments: commentsWithUsers,
          };
        })
      );

      // Step 3: Update the state with the fully populated photos
      this.setState({ photos: photosWithUserDetails });
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }

  render() {
    const { photos } = this.state;

    if (!photos) {
      return <Typography variant="body1">Loading photos...</Typography>;
    }

    if (photos.length === 0) {
      return (
        <Typography variant="body1">
          No photos available for this user.
        </Typography>
      );
    }

    return (
      <div>
        {photos.map((photo) => (
          <div key={photo._id} className="photo-container">
            <Typography variant="h6">{photo.date_time}</Typography>
            <img src={`/images/${photo.file_name}`} alt="user" />
            <div className="comments">
              {photo.comments &&
                photo.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <Typography variant="body2">
                      {comment.user ? (
                        <Link to={`/users/${comment.user._id}`}>
                          {comment.user.first_name} {comment.user.last_name}
                        </Link>
                      ) : (
                        "Unknown User"
                      )}
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
