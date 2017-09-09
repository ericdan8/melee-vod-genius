import React from 'react';
import CommentBullet from './CommentBullet';
import './CommentList.css';

export default class CommentList extends React.Component {
  constructor() {
    super();
  }

  render = () => {
    const comments = this.props.comments;
    return (
      <div className='commentList'>
        <CommentBullet/>
      </div>
    );
  }
}