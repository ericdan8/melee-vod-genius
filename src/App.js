import React, { Component } from 'react';
import VideoPlayer from './components/analysisView/VideoPlayer';
import CommentList from './components/analysisView/commentList/CommentList';
import CommentsTimeline from './components/analysisView/CommentsTimeline';
import LinkedList from 'dbly-linked-list';
import TextInput from './components/TextInput';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import YouTube from 'react-youtube';
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
  
  onGetVideoID = (history, input) => {
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
          history.push('/video/' + videoId);
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
        <Route exact path='/' render={({history}) =>
          <div className='videoIDInput'>
            <TextInput defaultValue='https://www.youtube.com/watch?v=2g811Eo7K8U' onConfirm={this.onGetVideoID.bind(this, history)}/>
          </div>
        }/>
        <Route path='/video/:videoId' render={({match}) => (
          // <div className='playerWrapper'>
          //   {this.state.videoPlayer}
          //   {/* {this.state.commentsTimeline} */}
          //   <CommentList comments={this.state.shownComments.map(comment => comment.getData())}/>
          // </div>
          // TODO: figure out a better way to store and display the comments
          <YouTube videoId={match.params.videoId}/>
        )}/>
      </div>
    </Router>
  );
}

export default App;