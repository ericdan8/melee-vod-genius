import React, { Component } from 'react';
import logo from './logo.svg';
import VideoPlayer from './components/VideoPlayer';
import CommentList from './components/CommentList';
import LinkedList from 'dbly-linked-list';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoID: '2g811Eo7K8U',
      comments: new LinkedList()
    }
    this.state.comments.insert({
      message: 'oops',
      startTime: 2,
      endTime: 3
    });
    this.state.comments.insert({
      message: 'overlap test',
      startTime: 2,
      endTime: 4
    });
    this.state.comments.insert({
      message: 'cat cat',
      startTime: 4.5,
      endTime: 9
    });
    this.state.comments.insert({
      message: 'interrupting',
      startTime: 6,
      endTime: 12
    });
  }



  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>VOD Genius</h2>
        </div>
        <div className='playerWrapper'>
          <VideoPlayer className='videoPlayer'
            videoID={this.state.videoID}
            comments={this.state.comments}
          />
          <CommentList />
        </div>
      </div>
    );
  }
}

export default App;
