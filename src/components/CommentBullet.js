import React from 'react';
import './CommentBullet.css';

export default class CommentBullet extends React.Component {
  render = () => (
    <div className='commentBullet'>
      <div>comment message</div>
      Message: <input/>
      Start Time: <input/>
      End Time: <input/>
    </div>
  )
}