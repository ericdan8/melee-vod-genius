import React from 'react';
// import './CommentListItem.css';
import './CommentListItem.css';

export default class CommentListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: true
    }
  }

  render = () => {
    let comment = this.props.comment;
    let message = this.state.visible ? <div className='commentMessage'>{comment.message}</div> : null;
    let author = this.state.visible ? <div className='commentAuthor'>{comment.author}</div> : null;
    let score = this.state.visible ? <div className='commentScore'>{comment.score}</div> : null;

    return (
      <div className='commentListItem'>
        <div className='commentHeader'>
          {score}
          {author}
        </div>
        <div className='commentBody'>
          <button onClick={this.toggleVisibility.bind(this)}/>
          {message}
        </div>
      </div>
    )
  }

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible});
  }
}