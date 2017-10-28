export default class TimerManager {
  
  constructor(options) {
    this.comments = options.comments;

    this.callbacks = {
      onCommentsChanged: options.onCommentsChanged
    }

    this._timer = null;
    this._shownComments = [];
    
    this._time = 0;
    this._tickLength = 125;
    this._generateEventQueue();
  }

  onPlay = time => {
    let timeToSeekTo = this._roundTime(time*1000);
    if (this._time !== timeToSeekTo) {
      this._time = timeToSeekTo;
    }
    if (!this._timer) {
      this._timer = setInterval(this._step.bind(this), this._tickLength);
      this._startTime = this._roundTime(Date.now());
      console.log(this._startTime);
    }
  }

  onPause = time => {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  _step = () => {
    console.log('stepping' + this._time);
    let events;

    if (this._eventQueue[this._time]) {
      events = this._eventQueue[this._time];
      events.forEach(event => {
        if (event.action === 'show') {
          this._addComment(event.comment);
        }
        if (event.action === 'hide') {
          this._removeComment(event.comment);
        }
      });
    }

    this._time += this._tickLength;
  }

  _addComment = comment => {
    this._shownComments.push(comment);
    this.callbacks.onCommentsChanged(this._shownComments);
  }
  
  _removeComment = comment => {
    this._shownComments.splice(this._shownComments.indexOf(comment), 1);
    this.callbacks.onCommentsChanged(this._shownComments);
  }

  _generateEventQueue = () => {
    let comments = this.comments;
    let eventQueue = {};

    comments.forEach(comment => {
      let startTime = comment.startTime * 1000;
      let endTime = comment.endTime * 1000;

      if (this.eventQueue) {
        this.eventQueue = null;
      }
      // add a show event
      if (!eventQueue[startTime]) {
        eventQueue[startTime] = [];
      }
      eventQueue[startTime].push({
        action: 'show',
        comment: comment
      });
      // add a hide event
      if (!eventQueue[endTime]) {
        eventQueue[endTime] = [];
      }
      eventQueue[endTime].push({
        action: 'hide',
        comment: comment
      });
    });

    this._eventQueue = eventQueue;
  }

  _roundTime = time => Math.round(time/this._tickLength)*this._tickLength

  destroy = () => {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}