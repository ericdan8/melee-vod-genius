import React from 'react';
import YouTubeDataHelper from '../controllers/YouTubeDataHelper';

export default class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: 'VOD Genius'
    };
  }

  render() {
    const videoShown = !!this.props.match && !!this.props.match.params.videoId;
    if (videoShown) {
      // TODO: show the currently-geniused video name in the app header
    }
  
    return (
      <div className={videoShown ? 'App-header videoShown' : 'App-header'}>
        <h2 onClick={this.onHeaderClick}>{this.state.titleText}</h2>
        {!this.props.match && 
        <h3>Paste a YouTube URL to get started</h3>}
      </div>
    );
  }

  onHeaderClick = () => {
    this.props.history.replace('/');
  }
}
