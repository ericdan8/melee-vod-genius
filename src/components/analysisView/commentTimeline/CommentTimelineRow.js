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

  onCommentClicked = comment => {
    if (this.props.onCommentClicked) {
      this.props.onCommentClicked(comment);
    } else {
      console.warn('CommentTimeline: no onCommentClicked prop passed');
    }
  }

  createRect = comment => {
    let duration = this.props.duration;
    let width = this.props.width || 640;
    let style = {
      width: ((comment.endTime - comment.startTime) / duration) * width,
      left: (comment.startTime / duration) * width
    };

    return <div className='commentRect' onClick={this.onCommentClicked.bind(this, comment)} style={style}>{comment.message}</div>;
  }
}