import React, { Component } from 'react';
import logo from './logo.svg';
import VideoPlayer from './components/analysisView/VideoPlayer';
import CommentList from './components/analysisView/commentList/CommentList';
import LinkedList from 'dbly-linked-list';
import TextInput from './components/TextInput';
import Tabletop from 'tabletop';
import './App.css';

'use strict';

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoID: '',
      comments: new LinkedList(),
      videoPlayer: null,
      shownComments: []
    }
    this.commentDB = null;

    Tabletop.init({
      key: 'https://docs.google.com/spreadsheets/d/1RLGEhOevwqDZlYam_XCC_RORm1Vke6LSrqK_TxZtpBc/edit?usp=sharing',
      callback: function(data, tabletop) { 
        this.commentDB = data;
      }.bind(this),
      simpleSheet: true
    });
  }

  _onCommentsChanged = newComments => {
    this.setState({shownComments: newComments});
  }
  
  onGetVideoID = input => {
    let videoID, matches, videoPlayer, rawComments, comments;
    let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    matches = input.match(rx)

    if (matches[1]) {
      videoID = matches[1];
      rawComments = this.getCommentsFromID(videoID);
      comments = this.buildComments(JSON.parse(rawComments));
      videoPlayer = this.buildPlayer({videoID, comments});
      this.setState({videoPlayer, videoID, comments});
    }
  }

  buildPlayer = options => (
    <VideoPlayer className='videoPlayer'
      videoID={options.videoID}
      comments={options.comments}
      onCommentsChanged={this._onCommentsChanged.bind(this)}
    />
  )

  getCommentsFromID = videoID => {
    let selectedVideo = this.commentDB.find(item => item.video === videoID);
    if (selectedVideo) {
      return selectedVideo.comments;
    }
  }

  buildComments = comments => {
    let list = new LinkedList();
    comments.forEach(list.insert, list);
    return list;
  }

  render = () => (
    <div className='App'>
      <div className='App-header'>
        <h2>VOD Genius</h2>
      </div>
      <div className='videoIDInput'>
        <h3>Paste a YouTube URL here:</h3>
        <TextInput value='2g811Eo7K8U' onConfirm={this.onGetVideoID.bind(this)}/>
      </div>
      <div className='playerWrapper'>
        {this.state.videoPlayer}
        <CommentList comments={this.state.shownComments.map(comment => comment.getData())}/>
      </div>
    </div>
  );
}

export default App;