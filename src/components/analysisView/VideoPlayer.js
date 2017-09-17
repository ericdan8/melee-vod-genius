import React from 'react';
import YouTube from 'react-youtube';
import TimerController from '../../controllers/analysisView/TimerController';
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

  render = () => {
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
          onPlay={this._onPlay.bind(this)}
          onStateChange={this._onStateChange}
        />
      </div>
    );
  }
  
  _onPause = event => {
    // this._clearTimers();
    if (!!this.timerController) {
      this.timerController.onPause(event.target.getCurrentTime());
    }
  }

  _onPlay = event => {
    if (!!this.timerController) {
      this.timerController.onPlay(event.target.getCurrentTime());
    }
  }

  _createTimerController = () => {
    this.timerController = new TimerController({
      comments: this.props.comments,
      player: this.player,
      showComment: this._addComment,
      hideComment: this._hideComment
    });
  }

  componentDidUpdate = (oldProps) => {
    if (this.props.comments.getHeadNode() && this.props.comments !== oldProps.comments) {
      if (this.timerController) {
        this.timerController.destroy();
      }
      this._createTimerController();
    }
  }

  _onReady = event => {
    this.player = event.target;
    if (this.props.comments.getHeadNode()) {
      if (this.timerController) {
        this.timerController.destroy();
      }
      this._createTimerController();
    }
  }

  _getShownIndex = __comment => {
    var i = 0;
    while (this.state.shownComments[i] && this.state.shownComments[i].getData().startTime < __comment.getData().startTime) {
      i++;
    }
    return i;
  }

  _getCommentList = () => 
    this.state.shownComments.map((comment) => 
      <li>{comment.getData().message}</li>
    )
  
  _clearComments = () => {
    this.setState({ shownComments: [] })
  }

  _hideComment = __comment => {
    let newComments = this.state.shownComments.slice();

    newComments.splice(newComments.indexOf(__comment), 1);
    this.setState({ shownComments: newComments });

    this.props.onCommentsChanged(newComments);
  }

  _addComment = __comment => {
    let newComments = this.state.shownComments.slice();

    newComments.splice(this._getShownIndex(__comment), 0, __comment);
    this.setState({ shownComments: newComments });

    this.props.onCommentsChanged(newComments);
  }
  
}