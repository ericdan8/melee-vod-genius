import React from 'react';
import { FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import '~/src/stylesheets/analysisView/CommentForm.css';

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      author: ''
    };
  }

  render() {
    return (
      <div className='commentFormWrapper'>
        <FormGroup>
          <ControlLabel>Comment Message</ControlLabel>
          <FormControl
            type="text"
            value={this.state.message}
            placeholder="Enter message"
            onChange={this.onMessageChange}
          />
          <ControlLabel>Author Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.author}
            placeholder="Enter author name"
            onChange={this.onAuthorChange}
          />
        </FormGroup>
        <Button type="submit" onClick={this.onSubmit}>
          Submit
        </Button>
      </div>
    );
  }

  onMessageChange = event => {
    this.setState({
      message: event.target.value
    });
  }
  
  onAuthorChange = event => {
    this.setState({
      author: event.target.value
    });
  }

  onSubmit = event => {
    if (this.props.onSubmit) {
      this.props.onSubmit({ ...this.state });
    }
  }
}