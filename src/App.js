import React, { Component } from 'react';
import VideoPlayer from './components/analysisView/VideoPlayer';
import LinkedList from 'dbly-linked-list';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AnalysisView from './components/analysisView/AnalysisView';
import VideoURLInput from './components/VideoURLInput';
import './App.css';
// https://www.youtube.com/watch?v=2g811Eo7K8U

class App extends Component {
  constructor() {
    super();
    this.state = {
      videoId: ''
    };
  }

  onGetVideoId = (videoId, history) => {
    history.push('/video/' + videoId);
    this.setState({videoId});
  }

  onHeaderClick = () => {
    this.props.history.replace('/');
    this.setState({videoId: ''});    
  }

  render = () => {
    return (
      <Router>
        <div className='App'>
          <Route path='/video/:videoId' children={(props) =>
            <div className={props.match && props.match.params.videoId ? 'App-header videoShown' : 'App-header'}>
              <h2 onClick={() => props.history.replace('/')}>VOD Genius</h2>
              {props}
            </div>}
          />
          <Route exact path='/:path(|video)' render={props => <VideoURLInput {...props} onGetVideoId={this.onGetVideoId}/>}/>
          <Route path='/video/:videoId' render={props => <AnalysisView {...props}/>}/>
        </div>
      </Router>
    );
  }
}

export default App;