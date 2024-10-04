import React from "react";
import { Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./userPhotos.css";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
    };
  }

  componentDidMount() {
    this.props.setDisplayType();
    const userId = this.props.match.params.userId;

    fetchModel(`/photosOfUser/${userId}`).then((response) => {
      this.setState({ photos: response.data });
    });
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
            <img src={`/images/${photo.file_name}`} />
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
