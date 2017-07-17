import React, { Component } from 'react';
import logo from './logo.svg';
import YouTube from 'react-youtube';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <YouTube
          videoId={"2g811Eo7K8U"}                  // defaults -> null
          onPause={pause.bind(this)}
          opts={{
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1
            }
          }}                        // defaults -> {}
        />
      </div>
    );
  }
}

function pause () {
  console.log(this.PlayerState);
}

export default App;
