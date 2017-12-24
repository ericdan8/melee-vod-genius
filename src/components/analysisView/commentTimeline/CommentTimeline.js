import React from 'react';
import CommentTimelineRow from './CommentTimelineRow';

import '~/src/stylesheets/analysisView/commentTimeline/CommentTimeline.css';

export default class CommentTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.width = this.props.width || 640;
    this.duration = this.props.duration;
  }

  render = () => (
    <div className='commentsTimeline'>
      {this.getRows(this.props.comments).map(row =>
      <CommentTimelineRow
        onCommentClicked={this.onCommentClicked}
        comments={row}
        duration={this.duration}
        width={this.width - 24}/>
      )}
    </div>
  )

  onCommentClicked = comment => {
    if (this.props.onCommentClicked) {
      this.props.onCommentClicked(comment);
    }
  }

  getRows = comments => {
    let rows = [];
    let rowCandidate = 0;
    comments.sort((c1, c2) => c1.startTime - c2.startTime);

    comments.forEach(comment => {
      rowCandidate = 0;
      while (rowCandidate < rows.length) {
        if (this.canBeInRow(rows[rowCandidate], comment)) {
          rows[rowCandidate].push(comment);
          break;
        }
        rowCandidate += 1;
      }
      // no suitable row found
      if (rowCandidate === rows.length) {
        rows.push([comment]);
      }
    }, this);

    return rows;
  }

  canBeInRow = (row, comment) => {
    return !row.some(rowComment => this.doCommentsOverlap(rowComment, comment), this);
  }

  doCommentsOverlap = (c1, c2) => c1.startTime > c2.startTime ? (c2.endTime > c1.startTime) : (c1.endTime > c2.startTime);
}