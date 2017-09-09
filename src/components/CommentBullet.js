import React from 'react';

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