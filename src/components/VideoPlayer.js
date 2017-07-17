import React from 'react';
import YouTube from 'react-youtube';

export default class VideoPlayer extends React.Component {
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
          onPause={this._onPause}
        />
      </div>
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  
  _onPause(event) {
    console.log(event.target.getCurrentTime());
  }
}