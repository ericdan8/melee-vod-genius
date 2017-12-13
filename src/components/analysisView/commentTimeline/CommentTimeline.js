import React from 'react';
import CommentTimelineRow from './CommentTimelineRow';

import '~/src/stylesheets/analysisView/commentTimeline/CommentTimeline.css';

export default class CommentTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.width = this.props.width || 640;
    this.duration = this.props.duration;
    this.comments = this.props.comments;
    this._rows = [];
    this.putCommentsIntoRows();
  }

  render = () => (
    <div className='commentsTimeline'>
      {this._rows.length > 0 ? this._rows.map(row =>
      <CommentTimelineRow
        onCommentClicked={this.onCommentClicked}
        comments={row}
        duration={this.duration}/>
      ) : 'No comments for this video yet :('}
    </div>
  )

  onCommentClicked = comment => {
    if (this.props.onCommentClicked) {
      this.props.onCommentClicked(comment);
    }
  }

  putCommentsIntoRows = () => {
    let rowCandidate = 0;
    this.comments.sort((c1, c2) => c1.startTime - c2.startTime);

    this.comments.forEach(comment => {
      rowCandidate = 0;
      while (rowCandidate < this._rows.length) {
        if (this.canBeInRow(this._rows[rowCandidate], comment)) {
          this._rows[rowCandidate].push(comment);
          break;
        }
        rowCandidate += 1;
      }
      // no suitable row found
      if (rowCandidate === this._rows.length) {
        this._rows.push([comment]);
      }
    }, this);
  }

  canBeInRow = (row, comment) => {
    return !row.some(rowComment => this.doCommentsOverlap(rowComment, comment), this);
  }

  doCommentsOverlap = (c1, c2) => c1.startTime > c2.startTime ? (c2.endTime > c1.startTime) : (c1.endTime > c2.startTime);
}