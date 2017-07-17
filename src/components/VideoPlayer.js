import React from 'react';
import YouTube from 'react-youtube';

export default class VideoPlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      videoID: '',
      message: ''
    }
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
        />
        <p>
          {this.state.message}
        </p>
      </div>
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  
  _onPause(event) {
    const { comments } = this.props;
    const currentTime = event.target.getCurrentTime();

    const strArray = comments.map((comment) =>
      currentTime > comment.startTime && currentTime < comment.endTime ? comment.message : ''
    );
    this.setState({ message: strArray.join('\n') });
  }
}