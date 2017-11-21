import React from 'react';
import '~/src/stylesheets/DraggableRange.css';

export default class DraggableRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      right: 50
    };
    this.gridSize = props.gridSize || 25;
    this.dragData = null;
  }

  roundPosition = position => Math.round(position / this.gridSize) * this.gridSize;

  onDragStartLeft = event => {
    console.log('drag started');
    this.dragData = {
      handle: 'left',
      startX: this.state.left
    };
    if (this.props.onDragStart) {
      this.props.onDragStart({
        handle: 'left',
        startX: this.state.left
      });
    }
  }
  
  onDragStartRight = event => {
    console.log('drag started');
    this.dragData = {
      handle: 'right',
      startX: this.state.left
    };
    if (this.props.onDragStart) {
      this.props.onDragStart({
        handle: 'right',
        startX: this.state.right
      });
    }
  }

  onDragEnd = event => {
    this.updatePosition({
      handle: this.dragData.handle,
      position: event.clientX
    }, () => {
      if (this.props.onDragEnd) {
        this.props.onDragEnd({
          handle: this.dragData.handle,
          endX: this.state.left
        });
      }
      this.dragData = null;
    });
  }

  onDrag = event => {
    console.log(event.clientX);
    if (this.dragData) {
      this.updatePosition({
        handle: this.dragData.handle,
        position: event.clientX
      }, () => {
        if (this.props.onDrag && this.dragData) {
          this.props.onDrag({
            handle: this.dragData.handle,
            posX: this.state[this.dragData.handle]
          });
        }
      });
    }
  }

  updatePosition = (drag, callback) => {
    if (drag.handle && drag.position) {
      var roundedPosition = this.roundPosition(drag.position);
      if (roundedPosition !== this.state[drag.handle]) {
        switch (drag.handle) {
        case 'left':
          if (roundedPosition < this.state.right) {
            this.setState({
              left: roundedPosition
            }, callback);
          }
          break;
        case 'right':
          if (roundedPosition > this.state.left) {
            this.setState({
              right: roundedPosition
            }, callback);
          }
          break;
        default:
          break;
        }
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
          onDrag={this.onDrag} 
          onDragEnd={this.onDragEnd}/>
        <div className='content' style={contentStyle}/>
        <div className='rightHandle handle'
          draggable
          style={rightHandleStyle}
          onDragStart={this.onDragStartRight} 
          onDrag={this.onDrag}
          onDragEnd={this.onDragEnd}/>
      </div>
    );
  }
}