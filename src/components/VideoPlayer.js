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
    let commentsAtNewTime = this._getCommentsShownAtTime(event.target.getCurrentTime());
    let commentsToRemove = this.state.shownComments.filter(comment => !commentsAtNewTime.includes(comment));
    let commentsToAdd = commentsAtNewTime.filter(comment => !this.state.shownComments.includes(comment));
    let nextComment = this._getNextCommentToShow(event.target.getCurrentTime());


    console.log("Removing " + commentsToRemove.length);
    console.log("Adding " + commentsToAdd.length);
    for (let i = 0; i < commentsToRemove.length; i++) {
      this._onHideCommentTimer(commentsToRemove[i]);
    }

    for (let i = 0; i < commentsToAdd.length; i++) {
      this._addComment(commentsToAdd[i], this._getShownIndex(commentsToAdd[i]));
    }

    this._clearTimers();
    this._setShowCommentTimer(nextComment);
  }

  _getShownIndex = __comment => {
    var i = 0;
    while (this.state.shownComments[i] && this.state.shownComments[i].getData().startTime < __comment.getData().startTime) {
      i++;
    }
    return i;
  }
  
  _onPause = event => {
    this._clearTimers();
  }

  _getCommentList = () => 
    this.state.shownComments.map((comment) => 
      <li>{comment.getData().message}</li>
    )

  _getCommentsShownAtTime = (time = this.player.getCurrentTime()) => {  
    var comments = [];
    var commentToCheck = this.props.comments.getHeadNode();

    while (commentToCheck.getData().startTime < time && commentToCheck.hasNext()) {
      if (commentToCheck.getData().endTime > time) {
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

  _setShowCommentTimer = (__commentToShow = this.props.comments.getHeadNode()) => {
    const currentTime = this.player.getCurrentTime();

    // clear any existing timer
    if (this.showCommentTimer) {
      clearTimeout(this.showCommentTimer);
      this.showCommentTimer = null;
    }

    if (__commentToShow) {
      this.showCommentTimer = setTimeout(this._onShowCommentTimer.bind(this, __commentToShow), 
      (__commentToShow.getData().startTime - currentTime) * (1000 / this.player.getPlaybackRate()));
    }
  }
  
  _onShowCommentTimer = __comment => {
    this._addComment(__comment);
    // Set the timer for the next comment to show
    if (__comment.hasNext()) {
      this._setShowCommentTimer(__comment.next);
    }
  }

  _setHideCommentTimer = __comment => {
    let currentTime = this.player.getCurrentTime();
    let newHideTimer = null;

    if (!__comment) {
      // No comment provided
      return;
    }
    
    newHideTimer = setTimeout(this._onHideCommentTimer.bind(this, __comment), (__comment.getData().endTime - currentTime) * (1000 / this.player.getPlaybackRate()));
    this.clearCommentTimers.push({ comment: __comment, timerID: newHideTimer});
  }

  _onHideCommentTimer = __comment => {
      let newComments = this.state.shownComments.slice();

      newComments.splice(newComments.indexOf(__comment), 1);
      this.setState({ shownComments: newComments });
      this._removeHideCommentTimer(__comment);
  }

  _removeHideCommentTimer = __comment => {
    if (!__comment) {
      // No comment provided
      return true;
    }
    for (var i = 0; i < this.clearCommentTimers.length; i++) {
      // TODO: update this check when comment IDs are added
      if (this.clearCommentTimers[i].comment.getData().message === __comment.getData().message) {
        this.clearCommentTimers.splice(i, 1);
        return false;
      }
    }
    return true;
  }

  _addComment = (__comment, __index = null) => {
    let newComments = this.state.shownComments.slice();

    // Show the comment
    if (__index === null) {
      newComments.push(__comment);
    } else { 
      newComments.splice(__index, 0, __comment);
    }
    this.setState({ shownComments: newComments });

    // Set a timer to remove the comment when it ends
    this._setHideCommentTimer(__comment);
  }
  
}