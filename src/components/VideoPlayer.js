import React from 'react';
import YouTube from 'react-youtube';
import './VideoPlayer.css';

export default class VideoPlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      videoID: '',
      shownComments: []
    }
    this.player = null;
    this.showCommentTimer = null;
    this.clearCommentTimers = [];
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    const { videoID } = this.props;

    return (
      <div className='Video-container'>
        <YouTube
          videoId={videoID}
          opts={opts}
          onReady={this._onReady}
          onPause={this._onPause}
          onPlay={this._onPlay}
          onStateChange={this._onStateChange}
        />
        <ul>
          {this._getCommentList()}
        </ul>
      </div>
    );
  }

  _onReady = event => {
    // access to player in all event handlers via event.target
    this.player = event.target;
  }

  _onPlay = event => {
    let commentsToKeep = this._getCommentsShownAtTime(event.target.getCurrentTime());
    let newComments = [];
    let nextComment = this._getNextCommentToShow(event.target.getCurrentTime());

    newComments = this.state.shownComments.filter(comment => commentsToKeep.includes(comment));
    this._clearTimers();
    this.setState({ shownComments: newComments });
    this._setShowCommentTimer(nextComment);
  }
  
  _onPause = event => {
    this._clearTimers();
  }

  _getCommentList = () => 
    this.state.shownComments.map((comment) => 
      <li>{comment.getData().message}</li>
    )
  
  _onStateChange = event => {

  }

  _getCommentsShownAtTime = (time = 0) => {  
    var comments = [];
    var commentToCheck = this.props.comments.getHeadNode();

    while (commentToCheck.startTime < time && commentToCheck.hasNext()) {
      if (commentToCheck.endTime > time) {
        comments.push(commentToCheck);
      }
      commentToCheck = commentToCheck.next;
    }

    return comments;
  }

  _getNextCommentToShow = (time = 0) => {
    var nextComment = this.props.comments.getHeadNode();

    while (nextComment.getData().startTime < time && nextComment.hasNext()) {
      nextComment = nextComment.next;
    }

    return nextComment;
  }
  _clearComments = () => {
    this.setState({ shownComments: [] })
  }

  _clearTimers = () => {
    clearTimeout(this.showCommentTimer);
    for (let i = 0; i < this.clearCommentTimers.length; i++) {
      clearTimeout(this.clearCommentTimers[i].timerID);
    }
    this.clearCommentTimers = [];
  }

  _setShowCommentTimer = (_commentToShow = this.props.comments.getHeadNode()) => {
    const currentTime = this.player.getCurrentTime();

    // clear any existing timer
    if (this.showCommentTimer) {
      clearTimeout(this.showCommentTimer);
      this.showCommentTimer = null;
    }

    if (_commentToShow) {
      this.showCommentTimer = setTimeout(this._onShowCommentTimer.bind(this, _commentToShow), 
      (_commentToShow.getData().startTime - currentTime) * (1000 / this.player.getPlaybackRate()));
    }
  }

  _removeHideCommentTimer = _comment => {
    if (!_comment) {
      // No comment provided
      return true;
    }
    for (var i = 0; i < this.clearCommentTimers.length; i++) {
      // TODO: update this check when comment IDs are added
      if (this.clearCommentTimers[i].comment.getData().message === _comment.getData().message) {
        this.clearCommentTimers.splice(i, 1);
        return false;
      }
    }
    return true;
  }

  _setHideCommentTimer = _comment => {
    let currentTime = this.player.getCurrentTime();
    let newHideTimer = null;

    if (!_comment) {
      // No comment provided
      return;
    }
    
    newHideTimer = setTimeout(() => {
      let newComments = this.state.shownComments.slice();

      newComments.splice(newComments.indexOf(_comment), 1);
      this.setState({ shownComments: newComments });
      this._removeHideCommentTimer(_comment);
    }, (_comment.getData().endTime - currentTime) * (1000 / this.player.getPlaybackRate()));
    this.clearCommentTimers.push({ comment: _comment, timerID: newHideTimer});
  }

  _onShowCommentTimer = _comment => {
    this._addComment(_comment);
    // Set the timer for the next comment to show
    if (_comment.hasNext()) {
      this._setShowCommentTimer(_comment.next);
    }
  }

  _addComment = _comment => {
    let newComments = this.state.shownComments.slice();

    // Show the comment
    newComments.push(_comment);
    this.setState({ shownComments: newComments });

    // Set a timer to remove the comment when it ends
    this._setHideCommentTimer(_comment);
  }
}