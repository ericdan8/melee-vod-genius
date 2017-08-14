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
          {this._getCommentString()}
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

  // _getComments(time) {
  //   var comments = [];
  //   var nextComment = this.props.comments.getHeadNode();
  //   while (nextComment.getData().startTime < this.player.getCurrentTime()) {
  //     if (nextComment.hasNext()){
  //       nextComment = nextComment.next;
  //     } else {
  //       // no next comment found
  //       return null;
  //     }
  //   }
  // }

  _getCommentString() {
    var commentString = '';
    var i = 0;
    for (i; i < this.state.shownComments.length; i++) {
      commentString = commentString + this.state.shownComments[i].getData().message + '\n';
    }
    return commentString;
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
    var newComments = this.state.shownComments.slice();

    // Show the comment
    newComments.push(_comment);
    this.setState({ shownComments: newComments });
    // Set a timer to remove the comment when it ends
    clearTimeout(this.hideCommentTimer);
    this.hideCommentTimer = setTimeout(this._onHideCommentTimer.bind(this, _comment), (_comment.getData().endTime - currentTime) * 1000);

    // Set the timer for the next comment to show
    if (_comment.hasNext()) {
      this._setShowCommentTimer(_comment.next);
    }
  }

  _onHideCommentTimer(_comment) {
    let newComments = this.state.shownComments.slice();

    newComments.splice(newComments.indexOf(_comment), 1);
    this.setState({ shownComments: newComments })
  }
}