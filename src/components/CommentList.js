import React from 'react';
import CommentListItem from './CommentListItem';
import './CommentList.css';

export default class CommentList extends React.Component {
  constructor() {
    super();
  }

  render = () => {
    const comments = this.props.comments;
    return (
      <div className='commentList'>
        {comments.map(comment => <CommentListItem message={comment.getData().message}/>)}
      </div>
    );
  }
}