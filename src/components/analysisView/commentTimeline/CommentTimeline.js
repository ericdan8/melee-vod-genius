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

  putCommentsIntoRows = () => {
    this._rows[0] = this.comments;
  }

  render = () => (
    <div className='commentsTimeline'>
      {this._rows.map(row => <CommentTimelineRow comments={row} duration={this.duration}/>)}
    </div>
  )

}