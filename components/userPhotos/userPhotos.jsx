import React from "react";
import { Typography, Divider, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./userPhotos.css";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      newComment:[], // Initialize newComments in the state
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
    this.setState((prevState) => {
      const newComment = [...prevState.newComment];
      newComment[photoId] = e.target.value;
      return { newComment };
    });
  };

  addComment = async (photoId) => {
    const commentText = this.state.newComment[photoId];

    console.log("Adding comment:", commentText);
    //if (!commentText || !commentText.trim()) return;

    try {
      const response = await axios.post(`/commentsOfPhoto/${photoId}`, {
        comment: commentText,
      });
      this.componentDidMount(); // Refresh the comments after adding
      this.setState({
        newComment: "", // Clear the new comment after adding
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

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
            <TextField
              value={this.state.newComment[photo._id] || ''}
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