import React from 'react';

import '~/src/stylesheets/analysisView/commentTimeline/CommentTimelineRow.css';

export default class CommentTimelineRow extends React.Component {
  render = () => {
    let comments = this.props.comments;
    
    return (
      <div className='commentsTimelineRow'>
        {comments.map(this.createRect, this)}
      </div>
    );
  }

  createRect = comment => {
    let duration = this.props.duration;
    let width = this.props.width || 640;
    let style = {
      width: ((comment.endTime - comment.startTime) / duration) * width,
      left: (comment.startTime / duration) * width,
      background: '#008000',
      opacity: 0.2
    };

    return (<div className='commentRect' style={style}/>);
  }
}