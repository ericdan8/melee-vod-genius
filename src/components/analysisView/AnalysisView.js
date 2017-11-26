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
      commentsTimeline: null,
      addCommentMode: false
    };
  }
  
  componentWillMount() {
    this.fetchComments();
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    };
    const { videoId } = this.props.match.params;

    return (
      <div className='analysisView'>
        <div className='videoContainer'>
          <Button bsStyle='primary' onClick={this.toggleAddCommentMode.bind(this)}>Add comment</Button>
          {this.state.videoPlayerVisible && 
          <VideoPlayer
            videoId={videoId}
            opts={opts}
            comments={this.state.comments}
            onCommentsChanged={this.onCommentsChanged.bind(this)}
            onReady={this.onVideoPlayerReady.bind(this)}
            addCommentMode={this.state.addCommentMode}
          />}
          {this.state.addCommentMode && 
          <DraggableRange
            gridSize={25}
          />}
          {this.state.commentTimelineVisible &&
          <CommentTimeline
            onCommentClicked={this.onCommentClicked.bind(this)}
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

  onCommentSubmitClicked(event) {
    
  }

  toggleAddCommentMode() {
    this.setState({
      addCommentMode: !this.state.addCommentMode
    });
  }

  fetchComments(videoId) {
    const { match } = this.props;
    
    this.getCommentsFromId(match.params.videoId)
    .then(commentData => {
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
  
  onVideoPlayerReady(event) {
    this.videoPlayer = event.target;
    this.setState({
      commentTimelineVisible: true
    });
  }

  onCommentClicked(comment) {
    this.videoPlayer.seekTo(comment.startTime, true);
  }

  onCommentsChanged(newCommments) {
    this.setState({
      shownComments: newCommments
    });
  }
  
  getCommentsFromId(videoId) {
    return new Promise((resolve, reject) => {
      axios.get(API_URL + videoId)
      .then(res => resolve(res.data.comments))
        .catch(err => reject(err));
    });
  }
}