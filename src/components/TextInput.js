import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.defaultValue || ''
    };
  }
  
  render = () => (
    <FormGroup>
      <FormControl
        type='text'
        placeholder='Paste a YouTube URL here...'
        value={this.state.text}
        onKeyDown={this.onKeyDown}
        onChange={this.onTextChange}
        />
      <Button bsStyle='primary' onClick={this.onButtonPress}>{this.props.buttonLabel}</Button>
    </FormGroup>
  )

  onTextChange = event => {
    this.setState({text: event.target.value});
  }

  onButtonPress = event => {
    this.props.onConfirm(this.state.text);
  }

  onKeyDown = event => {
    if (event.key === 19) {
      this.props.onConfirm(this.state.text);
    }
  }
}