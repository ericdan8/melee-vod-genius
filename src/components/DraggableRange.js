import React from 'react';
import '~/src/stylesheets/DraggableRange.css';

export default class DraggableRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: props.left || 0,
      right: props.right || 50
    };
    this.gridSize = props.gridSize || 25;
    this.maxWidth = Math.floor(props.maxWidth / this.gridSize) * this.gridSize;
    this.dragData = null;
  }

  roundPosition = position => Math.round(position / this.gridSize) * this.gridSize;

  onDragStartLeft = event => {
    this.dragData = {
      handle: 'left',
      startX: this.roundPosition(event.clientX)
    };
    // if (this.props.onDragStart) {
    //   this.props.onDragStart({
    //     handle: 'left',
    //     startX: this.state.left
    //   });
    // }
  }
  
  onDragStartRight = event => {
    this.dragData = {
      handle: 'right',
      startX: this.roundPosition(event.clientX)
    };
    // if (this.props.onDragStart) {
    //   this.props.onDragStart({
    //     handle: 'right',
    //     startX: this.state.right
    //   });
    // }
  }

  onDragEnd = event => {
    this.updatePosition({
      handle: this.dragData.handle,
      position: event.clientX
    }, () => {
      if (this.props.onDragEnd) {
        this.props.onDragEnd({
          handle: this.dragData.handle,
          position: this.state[this.dragData.handle]
        });
      }
      this.dragData = null;
    }, true);
  }

  onDrag = event => {
    if (this.dragData) {
      this.updatePosition({
        handle: this.dragData.handle,
        position: event.clientX
      }, () => {
        if (this.props.onDrag && this.dragData) {
          this.props.onDrag({
            handle: this.dragData.handle,
            position: this.state[this.dragData.handle]
          });
        }
      });
    }
  }

  updatePosition = (drag, callback, forceCallback) => {
    if (drag.handle && drag.position) {
      var roundedPosition = this.roundPosition(drag.position);
      var offset = roundedPosition - this.dragData.startX;
      // if the user has dragged far enough to trigger a positin update
      if (offset !== 0) {
        // console.log('updating ' + this.dragData.handle + ' with ' + roundedPosition);
        var newPosition = Math.max(Math.min(this.state[drag.handle] + offset, this.maxWidth - 10), 0);
        if (drag.handle === 'left' && newPosition < this.state.right ||
            drag.handle === 'right' && newPosition > this.state.left) {
          this.setState({
            [drag.handle]: newPosition
          }, callback);
          this.dragData.startX = roundedPosition;
        }
      } else if (forceCallback) callback();
    }
  }

  render() {
    let left = this.props.left || this.state.left;
    let right = this.props.right || this.state.right;
    const leftHandleStyle = {
      left: left + 'px',
      width: '10px'
    };
    const rightHandleStyle = {
      left: right + 'px',
      width: '10px'
    };
    const contentStyle = {
      left: (left + 10) + 'px',
      width: (right - left) + 'px'
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