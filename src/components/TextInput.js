import React from 'react';
import { Input, Button } from 'muicss/react';

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
    <div>
      <Input hint='Paste a YouTube URL here...' value={this.state.text} onChange={this.onTextChange.bind(this)}/>
      <Button onMouseUp={this.onButtonPress.bind(this)}>Submit URL</Button>
    </div>
  )
}