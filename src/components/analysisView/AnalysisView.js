import React from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import CommentList from './commentList/CommentList';
import '~/src/stylesheets/analysisView/AnalysisView.css';

const API_URL = 'http://localhost:3001/api/video/';

export default class AnalysisView extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      comments: [],
      videoPlayerVisible: false
    }
    
    this.getCommentsFromId(match.params.videoId)
    .then(commentData => {
      this.setState({
        comments: commentData,
        videoPlayerVisible: true
      });
    })
    .catch(err => {
      console.error('Error retrieving comments');
      console.error(err);
    });
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }
    const { videoId } = this.props.match.params;

    return (
      <div className='analysisView'>
        <div className='videoContainer'>
          {this.state.videoPlayerVisible && 
          <YouTube
            videoId={videoId}
            opts={opts}
          />}
          {/* {this.state.commentsTimeline} */}
        </div>
        <CommentList comments={this.state.comments}/>
      </div>
    );
  }
  
  getCommentsFromId(videoId) {
    return new Promise((resolve, reject) => {
      axios.get(API_URL + videoId)
      .then(res => resolve(res.data.comments))
        .catch(err => reject(err));
    });
  }
}