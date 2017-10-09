import React, { Component } from 'react';
import logo from './logo.svg';
import VideoPlayer from './components/analysisView/VideoPlayer';
import CommentList from './components/analysisView/commentList/CommentList';
import CommentsTimeline from './components/analysisView/CommentsTimeline';
import LinkedList from 'dbly-linked-list';
import TextInput from './components/TextInput';
import Tabletop from 'tabletop';
import axios from 'axios';
import './App.css';
// https://www.youtube.com/watch?v=2g811Eo7K8U

'use strict';

const API_URL = 'http://localhost:3001/api/video/';

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoID: '',
      comments: new LinkedList(),
      shownComments: [],
      videoPlayer: null,
      commentsTimeline: null
    }
    this.commentDB = null;

    Tabletop.init({
      key: 'https://docs.google.com/spreadsheets/d/1RLGEhOevwqDZlYam_XCC_RORm1Vke6LSrqK_TxZtpBc/edit?usp=sharing',
      callback: function(data, tabletop) { 
        this.commentDB = data;
        console.log('db ready');
      }.bind(this),
      simpleSheet: true
    });
  }

  _onCommentsChanged = newComments => {
    this.setState({shownComments: newComments});
  }

  _onPlayerReady = event => {
    // let commentsTimeline = <CommentsTimeline width={parseInt(event.target.a.width, 10)} duration={event.target.getDuration()} comments={this.state.comments} />
    // this.setState({commentsTimeline})
  }
  
  onGetVideoID = input => {
    let videoID, matches, videoPlayer, rawComments, comments;
    let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

    matches = input.match(rx)

    if (matches && matches[1]) {
      videoID = matches[1];
      this.getCommentsFromID(videoID).then(comments => {
        console.log(comments);
        var commentLL = this.buildComments(comments);
        videoPlayer = this.buildPlayer({videoID, comments: commentLL});
        this.setState({videoPlayer, videoID, comments});
      });
    }
  }

  buildPlayer = options => (
    <VideoPlayer className='videoPlayer'
      videoID={options.videoID}
      comments={options.comments}
      onCommentsChanged={this._onCommentsChanged.bind(this)}
      onReady={this._onPlayerReady.bind(this)}
    />
  )

  getCommentsFromID = videoID => {
    return new Promise((resolve, reject) => {
      axios.get(API_URL + videoID).then(function(res) {
        resolve(res.data.comments);
      });
    });
  }

  buildComments = comments => {
    // TODO: make sure comments are created in the correct order 
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
        <TextInput defaultValue='https://www.youtube.com/watch?v=2g811Eo7K8U' onConfirm={this.onGetVideoID.bind(this)}/>
      </div>
      <div className='playerWrapper'>
        {this.state.videoPlayer}
        {/* {this.state.commentsTimeline} */}
        <CommentList comments={this.state.shownComments.map(comment => comment.getData())}/>
      </div>
    </div>
  );
}

export default App;