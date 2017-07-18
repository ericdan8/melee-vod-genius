import React from 'react';
import YouTube from 'react-youtube';

export default class VideoPlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      videoID: '',
      message: ''
    }
    this.showCommentTimer = null;
    this.hideCommentTimer = null;
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    const { videoID, comments } = this.props;

    return (
      <div className='Video-container'>
        <YouTube
          videoId={videoID}
          opts={opts}
          onReady={this._onReady.bind(this)}
          onPause={this._onPause.bind(this)}
          onStateChange={this._onStateChange.bind(this)}
        />
        <p>
          {this.state.message}
        </p>
      </div>
    );
  }

  _showComment(comment) {
    this.setState({ message: comment.message });
  }

  _onHideCommentTimer() {
    this.setState({ message: '' })
  }

  _onShowCommentTimer(comment, currentTime) {
    this._showComment(comment);
    this._setHideCommentTimer(comment, currentTime);
  }

  _setHideCommentTimer(comment, currentTime) {
    clearTimeout(this.hideCommentTimer);
    this.hideCommentTimer = setTimeout(this._onHideCommentTimer.bind(this), (comment.endTime - currentTime) * 1000);
  }

  _setShowCommentTimer(event) {
    const { comments } = this.props;
    const currentTime = event.target.getCurrentTime();
    var nextComment;
    var i = 0;

    // clear any existing timer
    if (this.showCommentTimer) {
      clearTimeout(this.showCommentTimer);
    }
    // find the soonest comment
    for (i; i < comments.length; i++) {
      // if the comment has not already been shown and it's sooner than the current "soonest" comment
      if (!nextComment || // case where nextComment hasn't been initialized
        comments[i].startTime - currentTime > 0 && 
        comments[i].startTime - currentTime < nextComment.startTime - currentTime) {
        nextComment = comments[i];
      }
    }

    if (nextComment) {
      this.showCommentTimer = setTimeout(this._onShowCommentTimer.bind(this, nextComment, currentTime), (nextComment.startTime - currentTime) * 1000);
    }
  }

  _onStateChange(event) {
    // state of '1' means the video is currently playing
    if (event.data == 1) {
        // setTimeout(function() {console.log("timeout"), 1000});
        this._setShowCommentTimer(event);
    }
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  
  _onPause(event) {
    console.log('you paused the video good job');
  }
}