import React, { Component } from 'react';
import logo from './logo.svg';
import VideoPlayer from './components/VideoPlayer';
import CommentList from './components/CommentList';
import LinkedList from 'dbly-linked-list';
import TextInput from './components/TextInput';
import Tabletop from 'tabletop';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoID: '',
      comments: new LinkedList(),
      videoPlayer: null
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
  
  onGetVideoID = videoID => {
    let comments = this.getCommentsFromID(videoID);
    let videoPlayer, commentLL;

    if (comments) {
      commentLL = this.buildComments(JSON.parse(comments));
      videoPlayer = this.buildPlayer({videoID, comments: commentLL});
      this.setState({videoPlayer: null, videoID, comments: commentLL});
      this.setState({videoPlayer});
    }
  }

  buildPlayer = options => (
    <VideoPlayer className='videoPlayer'
      videoID={options.videoID}
      comments={options.comments}
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
        <TextInput value='2g811Eo7K8U' onConfirm={this.onGetVideoID.bind(this)}/>
      </div>
      <div className='playerWrapper'>
        {this.state.videoPlayer}
        <CommentList />
      </div>
    </div>
  );
}

export default App;