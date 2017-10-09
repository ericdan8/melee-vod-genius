import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.defaultValue || ''
    };
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
      <Button bsStyle='primary' onClick={this.onButtonPress.bind(this)}>Submit URL</Button>
    </FormGroup>
  )
}