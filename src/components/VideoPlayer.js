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

  _getCurrentlyShownComments = currentTime => {  
    var comments = [];
    var commentToCheck = this.props.comments.getHeadNode();

    while (commentToCheck.startTime < currentTime && commentToCheck.hasNext()) {
      if (commentToCheck.endTime > currentTime) {
        comments.push(commentToCheck);
      }
      commentToCheck = commentToCheck.next;
    }

    return comments;
  }

  _getNextCommentToShow = currentTime => {
    let nextComment = this.props.comments.getHeadNode();

    while (nextComment.startTime < currentTime && nextComment.hasNext) {
      nextComment = nextComment.next;
    }

    return nextComment;
  }

  _onReady = event => {
    // access to player in all event handlers via event.target
    this.player = event.target;
  }

  _onPlay = event => {
    let currentlyShownComments = this._getCurrentlyShownComments(event.target.getCurrentTime());
    let nextComment = this._getNextCommentToShow(event.target.getCurrentTime());

    this._clearComments();
    this._clearTimers();
    for (let i = 0; i < currentlyShownComments.length; i++) {
      this._addComment(currentlyShownComments[i]);
    }
    this._setShowCommentTimer(nextComment);
  }
  
  _onPause = event => {
    console.log('you paused the video good job');
    let i = 0;

    this._clearTimers();
  }

  _getCommentList = () => 
    this.state.shownComments.map((comment) => 
      <li>{comment.getData().message}</li>
    )
  
  _onStateChange = event => {
    // if (event.data === YouTube.PlayerState.PLAYING) {
    //     this._setShowCommentTimer(this.props.comments.getHeadNode());
    // }
  }

  _clearComments = () => {
    this.setState({ shownComments: [] })
  }

  _clearTimers = () => {
    clearTimeout(this.showCommentTimer);
    for (let i = 0; i < this.clearCommentTimers.length; i++) {
      clearTimeout(this.clearCommentTimers[i]);
    }
  }

  _setShowCommentTimer = _commentToShow => {
    const { comments } = this.props;
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

  _onShowCommentTimer = _comment => {
    this._addComment(_comment);
    // Set the timer for the next comment to show
    if (_comment.hasNext()) {
      this._setShowCommentTimer(_comment.next);
    }
  }

  _addComment = _comment => {
    const currentTime = this.player.getCurrentTime();
    let newComments = this.state.shownComments.slice();
    let newHideTimer = null;

    // Show the comment
    newComments.push(_comment);
    this.setState({ shownComments: newComments });

    // Set a timer to remove the comment when it ends
    newHideTimer = setTimeout(() => {
      let newComments = this.state.shownComments.slice();
      console.log(_comment);
      console.log(newHideTimer);
      newComments.splice(newComments.indexOf(_comment), 1);
      this.setState({ shownComments: newComments })
      this.clearCommentTimers.splice(this.clearCommentTimers.indexOf(newHideTimer, 1));
    }, (_comment.getData().endTime - currentTime) * (1000 / this.player.getPlaybackRate()));
    this.clearCommentTimers.push(newHideTimer);
  }
}