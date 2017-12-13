import React from 'react';
import { FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';
import '~/src/stylesheets/analysisView/CommentForm.css';

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      startTime: 0,
      endTime: 0
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
            placeholder="Enter text"
            onChange={this.onMessageChange}
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

  onSubmit = event => {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        message: this.state.message
      });
    }
  }
}