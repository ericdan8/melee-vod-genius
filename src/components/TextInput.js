import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

export default class TextInput extends React.Component {
  constructor() {
    super();
    this.state = {
      text: ''
    }
  }

  onTextChange = event => {
    this.setState({text: event.target.value});
  }

  onButtonPress = event => {
    this.props.onConfirm(this.state.text);
  }

  render = () => (
    <FormGroup>
      <FormControl
        type='text'
        placeholder='Paste a YouTube URL here...'
        value={this.state.text}
        onChange={this.onTextChange.bind(this)}
      />
      <Button bsStyle='primary'>Submit URL</Button>
    </FormGroup>
  )
}