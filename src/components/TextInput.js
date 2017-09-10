import React from 'react';

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
      <input value={this.state.text} onChange={this.onTextChange.bind(this)}/>
      <button onClick={this.onButtonPress.bind(this)}/>
    </div>
  )
}