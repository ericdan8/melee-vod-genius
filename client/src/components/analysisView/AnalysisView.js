import React from 'react';
import axios from 'axios';
import CommentList from './commentList/CommentList';
import CommentTimeline from './commentTimeline/CommentTimeline';
import VideoPlayer from './VideoPlayer';
import DraggableRange from '../DraggableRange';
import CommentForm from './CommentForm';
import { Button } from 'react-bootstrap';
import '~/src/stylesheets/analysisView/AnalysisView.css';

const API_URL = 'http://localhost:3001/api/video/';

export default class AnalysisView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      videoPlayerVisible: false,
      shownComments: [],
      addCommentMode: false,
      leftHandle: 0,
      rightHandle: 50
    };
    this.videoWidth = props.videoWidth || 640;
    this.videoHeight = props.videoHeight || 390;
    this.videoId = this.props.match.params.videoId;
  }
  
  componentWillMount() {
    this.fetchComments();
  }

  render() {
    const opts = {
      height: this.videoHeight,
      width: this.videoWidth,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    };

    return (
      <div className='analysisView'>
        <div className='videoContainer'>
          {this.state.videoPlayerVisible && 
          <Button className='addCommentButton' bsStyle='default' onClick={this.toggleAddCommentMode}>Add comment</Button>}
          {this.state.videoPlayerVisible && 
          <VideoPlayer
            videoId={this.videoId}
            opts={opts}
            comments={this.state.comments}
            onCommentsChanged={this.onCommentsChanged}
            onReady={this.onVideoPlayerReady}
            addCommentMode={this.state.addCommentMode}
          />}
          {this.state.addCommentMode && 
          <DraggableRange
            gridSize={25}
            maxWidth={640}
            left={this.state.leftHandle}
            right={this.state.rightHandle}
            onDragEnd={this.onDragEnd}
            onDrag={this.onDrag}
          />}
          {this.state.commentTimelineVisible &&
          <CommentTimeline
            onCommentClicked={this.onCommentClicked}
            duration={this.videoPlayer.getDuration()}
            comments={this.state.comments}
          />}
        </div>
        {this.state.addCommentMode &&
        <CommentForm
          onSubmit={this.onCommentSubmitClicked.bind(this)}
        />}
        <CommentList comments={this.state.shownComments}/>
      </div>
    );
  }

  onDragEnd = event => {
    this.setState({
      [event.handle + 'Handle']: event.position
    }, () => console.log(event.handle + ' ' + this.state[event.handle + 'Handle']));
  }

  onDrag = event => {
    // TODO: seek to the time indicated by the drag
    this.setState({
      [event.handle + 'Handle']: event.position
    });
    this.videoPlayer.seekTo(this._convertPositionToTime(event.position));
  }

  onCommentSubmitClicked = event => {
    var { message, author, startTime, endTime } = event;
    startTime = this._convertPositionToTime(this.state.leftHandle);
    endTime = this._convertPositionToTime(this.state.rightHandle);

    this.sendComment({ message, author, startTime, endTime, score: 0 }).then(this.fetchComments);
  }

  toggleAddCommentMode = () => {
    this.setState({
      addCommentMode: !this.state.addCommentMode
    });
  }

  fetchComments = () => {
    this._getCommentsFromId(this.videoId).then(commentData => {
      this.setState({
        comments: commentData,
        videoPlayerVisible: true
      });
    })
    .catch(err => {
      console.error('Error retrieving comments');
      console.error(err);
    });
  }
  
  onVideoPlayerReady = event => {
    this.videoPlayer = event.target;
    this.setState({
      commentTimelineVisible: true
    });
  }

  onCommentClicked = comment => {
    this.videoPlayer.seekTo(comment.startTime, true);
  }

  onCommentsChanged = newComments => {
    this.setState({
      shownComments: newComments
    });
  }
  
  _getCommentsFromId = videoId => {
    return new Promise((resolve, reject) => {
      axios.get(API_URL + videoId)
        .then(res => resolve(res.data.comments))
        .catch(err => reject(err));
    });
  }

  sendComment = commentSpec => {
    return new Promise((resolve, reject) => {
      axios.post(API_URL + this.videoId, commentSpec)
        .then(resolve)
        .catch(err => console.log(err));
    })
  }

  _convertPositionToTime = position => this.videoPlayer && (position / (this.videoWidth)) * this.videoPlayer.getDuration();
}