import React from "react";
import { Typography, Divider, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./userPhotos.css";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
      newComments: {}, // Track new comments for each photo by photo ID
    };
  }

  async componentDidMount() {
    this.props.setDisplayType();
    const userId = this.props.match.params.userId;

    try {
      const photoResponse = await axios.get(`/photosOfUser/${userId}`);
      const photos = photoResponse.data;

      const photosWithUserDetails = await Promise.all(
        photos.map(async (photo) => {
          const commentsWithUsers = await Promise.all(
            photo.comments.map(async (comment) => {
              if (comment.user && comment.user._id) {
                try {
                  const userResponse = await axios.get(
                    `/user/${comment.user._id}`
                  );
                  const user = userResponse.data;
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
                  return comment;
                }
              } else {
                return comment;
              }
            })
          );

          return {
            ...photo,
            comments: commentsWithUsers,
          };
        })
      );

      this.setState({ photos: photosWithUserDetails });
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }

  handleCommentChange = (photoId, e) => {
    // Update new comment for a specific photo
    this.setState((prevState) => ({
      newComments: {
        ...prevState.newComments,
        [photoId]: e.target.value,
      },
    }));
  };

  addComment = async (photoId) => {
    const { newComments, photos } = this.state;
    const commentText = newComments[photoId];

    if (!commentText || !commentText.trim()) return;

    try {
      const response = await axios.post(`/commentsOfPhoto/${photoId}`, {
        comment: commentText,
      });
      const addedComment = response.data;

      // Update the specific photo's comments in the state
      const updatedPhotos = photos.map((photo) => {
        if (photo._id === photoId) {
          return {
            ...photo,
            comments: [...photo.comments, addedComment], // Add the new comment to the existing comments
          };
        }
        return photo;
      });

      this.setState({
        photos: updatedPhotos,
        newComments: {
          ...newComments,
          [photoId]: "", // Clear the input for this photo after submitting
        },
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      if (error.response && error.response.status === 400) {
        alert("Comment cannot be empty.");
      }
    }
  };

  render() {
    const { photos, newComments } = this.state;

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
            <TextField
              value={newComments[photo._id] || ""}
              onChange={(e) => this.handleCommentChange(photo._id, e)}
              placeholder="Add a comment..."
              variant="outlined"
              size="small"
              fullWidth
              className="comment-input"
            />
            <Button
              onClick={() => this.addComment(photo._id)}
              variant="contained"
              color="primary"
              className="comment-button"
            >
              Submit
            </Button>
          </div>
        ))}
      </div>
    );
  }
}

export default UserPhotos;