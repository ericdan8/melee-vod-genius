export default class TimerManager {
  
  constructor(options) {
    this.comments = options.comments;
    this.player = options.player;

    this.callbacks = {
      onCommentsChanged: options.onCommentsChanged
    };

    this._timer = null;
    this._shownComments = [];
    
    this._time = 0;
    this._tickLength = 125;
    this._generateEventQueue();
  }

  play = time => {
    let timeToSeekTo = this._roundTime(time*1000);
    this.seekTo(timeToSeekTo);
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._timer = setInterval(this._step, this._tickLength * (1/this.player.getPlaybackRate()));
    this._startTime = this._roundTime(Date.now()) - this._time;
    console.log(this._startTime);
  }

  pause = time => {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
      this._startTime = null;
    }
  }

  seekTo = time => {
    this._clearComments();
    let eventTimes = Object.keys(this._eventQueue);
    let commentsToShow = [];
    let events;

    this._time = time;
    eventTimes.every(eventTime => {
      if (eventTime < this._time) {
        events = this._eventQueue[eventTime];
        events.forEach(event => {
          if (event.action === 'show' && event.comment.endTime > this._time/1000) {
            commentsToShow.push(event.comment);
          }
        });
      }
      return eventTime < this._time;
    });

    commentsToShow.forEach(this._addComment);
  }

  _step = () => {
    let targetTime = Date.now() - this._startTime;
    // console.log('target ' + targetTime);
    if (this._startTime) {
      while (this._time < targetTime) {
        // console.log('stepping ' + this._time);
        this._executeTick(this._time);
        this._time += this._tickLength;
      }
    }
  }
  
  _executeTick = tick => {
    let events;
    if (this._eventQueue[tick]) {
      events = this._eventQueue[tick];
      events.forEach(event => {
        if (event.action === 'show') {
          this._addComment(event.comment);
        }
        if (event.action === 'hide') {
          this._removeComment(event.comment);
        }
      });
    }
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

  _clearComments = () => {
    this._shownComments = [];
    this.callbacks.onCommentsChanged(this._shownComments);
  }

  _roundTime = time => Math.round(time/this._tickLength)*this._tickLength

  destroy = () => {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}