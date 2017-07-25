import React from 'react';
import YouTube from 'react-youtube';
import './VideoPlayer.css';

export default class VideoPlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      videoID: '',
      message: ''
    }
    this.player = null;
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
    const { videoID } = this.props;

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

  _onReady(event) {
    // access to player in all event handlers via event.target
    this.player = event.target;
    this.player.pauseVideo();
  }
  
  _onPause(event) {
    console.log('you paused the video good job');
  }

  _onStateChange(event) {
    // state of '1' means the video is currently playing
    // TODO: replace this gross number
    if (event.data === 1) {
        // setTimeout(function() {console.log("timeout"), 1000});
        this._setShowCommentTimer(this.props.comments.getHeadNode());
    }
  }

  _setShowCommentTimer(_commentToShow) {
    const { comments } = this.props;
    const currentTime = this.player.getCurrentTime();
    var nextComment;
    var i = 0;

    // clear any existing timer
    if (this.showCommentTimer) {
      clearTimeout(this.showCommentTimer);
    }

    if (_commentToShow) {
      this.showCommentTimer = setTimeout(this._onShowCommentTimer.bind(this, _commentToShow), (_commentToShow.getData().startTime - currentTime) * 1000);
    }
  }

  _onShowCommentTimer(_comment) {
    const currentTime = this.player.getCurrentTime();

    // Show a comment
    this.setState({ message: _comment.getData().message });
    // Set a timer to remove the comment when it ends
    clearTimeout(this.hideCommentTimer);
    this.hideCommentTimer = setTimeout(this._onHideCommentTimer.bind(this), (_comment.getData().endTime - currentTime) * 1000);

    // Set the timer for the next comment to show
    if (_comment.hasNext()) {
      this._setShowCommentTimer(_comment.next);
    }
  }

  _onHideCommentTimer() {
    this.setState({ message: '' })
  }
}