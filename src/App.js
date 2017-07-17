import React, { Component } from 'react';
import logo from './logo.svg';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoID: '2g811Eo7K8U',
      comments: [
        {
          message: "oops",
          startTime: 2,
          endTime: 3
        },
        {
          message: "cat cat",
          startTime: 4.5,
          endTime: 7
        }
      ]
    }
  }

  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React</h2>
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <VideoPlayer
          videoID={this.state.videoID}
          comments={this.state.comments}
        />
      </div>
    );
  }
}

export default App;
