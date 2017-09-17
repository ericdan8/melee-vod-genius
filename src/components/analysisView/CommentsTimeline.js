import React from 'react';

import './CommentsTimeline.css';

export default class CommentsTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.width = this.props.width || 640;
    this.duration = this.props.duration;
    this.comments = this.props.comments;
  }

  render = () => (
    <div className='commentsTimeline'>
      {this.comments.map(this.createRect, this)}
    </div>
  )

  createRect = comment => {
    let style = {
      width: ((comment.endTime - comment.startTime) / this.duration) * this.width,
      left: (comment.startTime / this.duration) * this.width,
      background: '#008000',
      opacity: 0.2
    }

    return (<div className='commentRect' style={style}/>)

  }
}