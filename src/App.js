import React, { Component } from 'react';
import VideoPlayer from './components/analysisView/VideoPlayer';
import CommentList from './components/analysisView/commentList/CommentList';
import CommentsTimeline from './components/analysisView/CommentsTimeline';
import LinkedList from 'dbly-linked-list';
import TextInput from './components/TextInput';
import axios from 'axios';
import './App.css';
// https://www.youtube.com/watch?v=2g811Eo7K8U

'use strict';

const API_URL = 'http://localhost:3001/api/video/';

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
  
  onGetVideoID = input => {
    let videoId, matches, videoPlayer, comments;
    let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;

    matches = input.match(rx)

    if (matches && matches[1]) {
      videoId = matches[1];
      this.getCommentsFromID(videoId)
        .then(commentData => {
          comments = this.buildComments(commentData);
          videoPlayer = this.buildPlayer({videoId, comments});
          this.setState({videoPlayer, videoId, commentData});
        })
        .catch(err => {
          console.error('Error retrieving comments...');
          console.error(err);
        });
    }
  }

  buildPlayer = options => (
    <VideoPlayer className='videoPlayer'
      videoId={options.videoId}
      comments={options.comments}
      onCommentsChanged={this._onCommentsChanged.bind(this)}
      onReady={this._onPlayerReady.bind(this)}
    />
  )

  getCommentsFromID = videoId => {
    return new Promise((resolve, reject) => {
      axios.get(API_URL + videoId)
        .then(res => resolve(res.data.comments))
        .catch(err => reject(err));
    });
  }

  buildComments = comments => {
    // TODO: make sure comments are created in the correct order 
    let list = new LinkedList();
    comments.sort((a, b) => a.startTime - b.startTime);
    comments.forEach(list.insert, list);
    return list;
  }

  render = () => (
    <div className='App'>
      <div className='App-header'>
        <h2>VOD Genius</h2>
      </div>
      <div className='videoIdInput'>
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