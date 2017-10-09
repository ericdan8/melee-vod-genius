import React, { Component } from 'react';
import VideoPlayer from './components/analysisView/VideoPlayer';
import LinkedList from 'dbly-linked-list';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AnalysisView from './components/analysisView/AnalysisView';
import VideoURLInput from './components/VideoURLInput';
import './App.css';
// https://www.youtube.com/watch?v=2g811Eo7K8U

'use strict';

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoId: '',
      comments: new LinkedList(),
      shownComments: [],
      videoPlayer: null,
      commentsTimeline: null
    }
    this.commentDB = null;
  }

  _onCommentsChanged = newComments => {
    this.setState({shownComments: newComments});
  }

  _onPlayerReady = event => {
    // let commentsTimeline = <CommentsTimeline width={parseInt(event.target.a.width, 10)} duration={event.target.getDuration()} comments={this.state.comments} />
    // this.setState({commentsTimeline})
  }
  
  buildPlayer = options => (
    <VideoPlayer className='videoPlayer'
      videoId={options.videoId}
      comments={options.comments}
      onCommentsChanged={this._onCommentsChanged.bind(this)}
      onReady={this._onPlayerReady.bind(this)}
    />
  )

  buildComments = comments => {
    let list = new LinkedList();
    comments.sort((a, b) => a.startTime - b.startTime);
    comments.forEach(list.insert, list);
    return list;
  }

  render = () => (
    <Router>
      <div className='App'>
        <div className='App-header'>
          <h2>VOD Genius</h2>
        </div>
        <Route exact path='/' component={VideoURLInput}/>
        <Route path='/video/:videoId' component={AnalysisView}/>
      </div>
    </Router>
  );
}

export default App;