import React from 'react';
import YouTube from 'react-youtube';
import TimerManager from '../../controllers/analysisView/TimerManager';
import '~/src/stylesheets/analysisView/VideoPlayer.css';

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: '',
      shownComments: []
    };
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
    const { videoId } = this.props;

    return (
      <div className='Video-container'>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={this._onReady.bind(this)}
          onPause={this._onPause.bind(this)}
          onPlay={this._onPlay.bind(this)}
          onEnd={this._onEnd.bind(this)}
          onStateChange={this._onStateChange}
        />
      </div>
    );
  }
  
  _onPause = event => {
    // this._clearTimers();
    if (!!this.timerManager) {
      this.timerManager.pause(event.target.getCurrentTime());
    }
  }

  _onPlay = event => {
    if (!!this.timerManager) {
      this.timerManager.play(event.target.getCurrentTime());
    }
  }

  _onEnd = event => {
    if (!!this.timerManager) {
      this.timerManager.pause(event.target.getCurrentTime());
    }
  }

  _createTimerManager = () => {
    this.timerManager = new TimerManager({
      comments: this.props.comments,
      player: this.player,
      onCommentsChanged: this._onCommentsChanged.bind(this)
    });
  }

  componentDidUpdate = (oldProps) => {
    if (this.props.comments && this.props.comments !== oldProps.comments) {
      if (this.timerManager) {
        this.timerManager.destroy();
      }
      this._createTimerManager();
    }
  }

  _onReady = event => {
    this.player = event.target;
    if (this.props.comments) {
      if (this.timerManager) {
        this.timerManager.destroy();
      }
      this._createTimerManager();
    }
    if (this.props.onReady) {
      this.props.onReady(event);
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
    this.setState({ shownComments: [] });
  }

  _hideComment = comment => {
    let newComments = this.state.shownComments.slice();

    newComments.splice(newComments.indexOf(comment), 1);
    this.setState({ shownComments: newComments });

    this.props.onCommentsChanged(newComments);
  }

  _addComment = comment => {
    let newComments = this.state.shownComments.slice();

    newComments.splice(this._getShownIndex(comment), 0, comment);
    this.setState({ shownComments: newComments });

    this.props.onCommentsChanged(newComments);
  }
  
  _onCommentsChanged = newComments => {
    this.setState({ shownComments: newComments });
    this.props.onCommentsChanged(newComments);
  }
}