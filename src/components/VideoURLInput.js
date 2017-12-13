import React from 'react';
import TextInput from './TextInput';

export default class VideoURLInput extends React.Component {
  onGetVideoID = input => {
    let videoId, matches;
    let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;

    matches = input.match(rx);

    if (matches && matches[1]) {
      videoId = matches[1];
      if (this.props.onGetVideoId) {
        this.props.onGetVideoId(videoId, this.props.history);
      }
    }
  }

  render() {
    return (
      <div className='videoIdInput'>
        <TextInput defaultValue='https://www.youtube.com/watch?v=2g811Eo7K8U' onConfirm={this.onGetVideoID.bind(this)}/>
      </div>
    );
  }
}