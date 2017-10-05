import React from 'react';
// import './CommentListItem.css';
import '~/src/stylesheets/analysisView/commentList/CommentListItem.css';

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
    let author = <div className='commentAuthor'>{comment.author}</div>;
    let score = <div className='commentScore'>{comment.score}</div>;

    return (
      <div className='commentListItem'>
        <div className='commentHeader'>
          <button className='toggleVisibility' onClick={this.toggleVisibility.bind(this)}/>
          {score}
          {author}
        </div>
        <div className='commentBody'>
          {message}
        </div>
      </div>
    )
  }

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible});
  }
}