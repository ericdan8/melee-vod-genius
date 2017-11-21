import React from 'react';
import '~/src/stylesheets/DraggableRange.css';

export default class DraggableRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      right: 50
    };
    if (props.gridSize) {
      this.gridSize = props.gridSize;
    }
  }

  onDragStartLeft = event => {
    console.log('drag started');
  }

  onDragEndLeft = event => {
    this.updatePosition({
      handle: 'left',
      position: event.clientX
    });
  }

  onDragLeft = event => {
    console.log(event.clientX);
    this.updatePosition({
      handle: 'left',
      position: event.clientX
    });
  }

  onDragStartRight = event => {
    console.log('drag started');
  }

  onDragEndRight = event => {
    this.updatePosition({
      handle: 'right',
      position: event.clientX
    });
  }

  onDragRight = event => {
    console.log(event.clientX);
    this.updatePosition({
      handle: 'right',
      position: event.clientX
    });
  }

  updatePosition = drag => {
    if (drag.handle && drag.position) {
      switch (drag.handle) {
      case 'left':
        if (drag.position < this.state.right) {
          this.setState({
            left: drag.position
          });
        }
        break;
      case 'right':
        if (drag.position > this.state.left) {
          this.setState({
            right: drag.position
          });
        }
        break;
      default:
        break;
      }
    }
  }

  render() {
    const leftHandleStyle = {
      left: this.state.left + 'px',
      width: '10px'
    };
    const rightHandleStyle = {
      left: this.state.right + 'px',
      width: '10px'
    };
    const contentStyle = {
      left: (this.state.left + 10) + 'px',
      width: (this.state.right - this.state.left) + 'px'
    };

    return (
      <div className='draggableRange'>
        <div className='leftHandle handle' 
          draggable 
          style={leftHandleStyle} 
          onDragStart={this.onDragStartLeft} 
          onDrag={this.onDragLeft} 
          onDragEnd={this.onDragEndLeft}/>
        <div className='content' style={contentStyle}/>
        <div className='rightHandle handle'
          draggable
          style={rightHandleStyle}
          onDragStart={this.onDragStartRight} 
          onDrag={this.onDragRight}
          onDragEnd={this.onDragEndRight}/>
      </div>
    );
  }
}