import React from 'react';
import CommentListItem from './CommentListItem';
import '~/src/stylesheets/analysisView/commentList/CommentList.css';

const CommentList = (props) => {
  const { comments } = props;
  return (
    <div className='commentList'>
      {comments.map(comment => <CommentListItem comment={comment} key={comment._id}/>)}
    </div>
  );
}

export default CommentList;