import React from 'react';
import './CommentListItem.css';

export default class CommentListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: true
    }
  }

  render = () => (
    <div className='commentBullet'>
      <button onClick={this.toggleVisibility.bind(this)}/>
      <div className='commentMessage'>
        {this.state.visible ? this.props.message : ''}
      </div>
    </div>
  )

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible});
  }
}