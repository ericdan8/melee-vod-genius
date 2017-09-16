export default class TimerController {

  constructor(options) {
    this.comments = options.comments;
    this.showComment = options.showComment;
    this.hideComment = options.hideComment;
    this.player = options.player;

    this.showCommentTimer = null;
    this.clearCommentTimers = [];
    this.shownComments = [];
  }

  onPause = event => {
    this._clearTimers();
  }

  onPlay = time => {
    // console.log("currently shown: ");
    // console.log(this.shownComments);
    let commentsAtNewTime = this._getCommentsShownAtTime(time);
    // console.log("new comments: ");
    // console.log(commentsAtNewTime);
    var commentsToRemove = this.shownComments.filter(comment => !commentsAtNewTime.includes(comment));
    var commentsToAdd = commentsAtNewTime.filter(comment => !this.shownComments.includes(comment));
    let nextComment = this._getNextCommentToShow(time);

    // console.log("Removing " + commentsToRemove.length);
    // console.log(commentsToRemove);
    // console.log("Adding " + commentsToAdd.length);
    // console.log(commentsToAdd);

    this._clearTimers();
    commentsToRemove.forEach(this._onHideCommentTimer, this);

    // set hide timers for comments that were kept
    this.shownComments.forEach(comment => {
      if (this._getHideCommentTimerIndex(comment) === -1) {
        this._setHideCommentTimer(comment);
      }
    }, this);

    commentsToAdd.forEach(this._addComment, this);

    if (nextComment) {
      this._setShowCommentTimer(nextComment);
    }
  }

  _getShownIndex = __comment => {
    var i = 0;
    while (this.shownComments[i] && this.shownComments[i].getData().startTime < __comment.getData().startTime) {
      i++;
    }
    return i;
  }

  _getCommentsShownAtTime = time => {  
    var comments = [];
    var commentToCheck = this.comments.getHeadNode();

    if (!time) {
      return;
    }
    while (commentToCheck && commentToCheck.getData().startTime < time) {
      if (commentToCheck.getData().endTime > time) {
        comments.push(commentToCheck);
      }
      commentToCheck = commentToCheck.next;
    }

    return comments;
  }

  _getNextCommentToShow = (time = 0) => {
    var nextComment = this.comments.getHeadNode();

    while (nextComment && nextComment.getData().startTime < time) {
      nextComment = nextComment.next;
    }

    return nextComment;
  }
  
  _clearComments = () => {
    this.shownComments = [];
  }

  _clearTimers = () => {
    clearTimeout(this.showCommentTimer);
    for (let i = 0; i < this.clearCommentTimers.length; i++) {
      clearTimeout(this.clearCommentTimers[i].timerID);
    }
    this.clearCommentTimers = [];
  }

  _setShowCommentTimer = (__commentToShow = this.comments.getHeadNode()) => {
    const currentTime = this.player.getCurrentTime();

    // clear any existing timer
    if (this.showCommentTimer) {
      clearTimeout(this.showCommentTimer);
      this.showCommentTimer = null;
    }

    if (__commentToShow) {
      this.showCommentTimer = setTimeout(this._onShowCommentTimer.bind(this, __commentToShow), 
      (__commentToShow.getData().startTime - currentTime) * (1000 / this.player.getPlaybackRate()));
    }
  }
  
  _onShowCommentTimer = __comment => {
    this._addComment(__comment);
    // Set the timer for the next comment to show
    if (__comment.hasNext()) {
      this._setShowCommentTimer(__comment.next);
    }
  }

  _setHideCommentTimer = __comment => {
    let currentTime = this.player.getCurrentTime();
    let newHideTimer = null;

    if (!__comment) {
      // No comment provided
      return;
    }
    
    newHideTimer = setTimeout(this._onHideCommentTimer.bind(this, __comment), (__comment.getData().endTime - currentTime) * (1000 / this.player.getPlaybackRate()));
    this.clearCommentTimers.push({ comment: __comment, timerID: newHideTimer});
  }

  _onHideCommentTimer = __comment => {
    this.shownComments.splice(this.shownComments.indexOf(__comment), 1);
    this.hideComment(__comment);
    this._removeHideCommentTimer(__comment);
  }

  _getHideCommentTimerIndex = __comment => {
    if (!__comment) {
      return -1;
    }
    for (let i = 0; i < this.clearCommentTimers.length; i++) {
      // TODO: update this check when comment IDs are added
      if (this.clearCommentTimers[i].comment.getData().message === __comment.getData().message) {
        return i;
      }
    }
    return -1;
  }

  _removeHideCommentTimer = __comment => {
    if (!__comment) {
      // No comment provided
      return true;
    }

    var index = this._getHideCommentTimerIndex(__comment);

    if (index > -1) {
      this.clearCommentTimers.splice(index, 1);
    }
  }

  _addComment = __comment => {
    this.shownComments.splice(this._getShownIndex(__comment), 0, __comment);
    this.showComment(__comment);
    // Set a timer to remove the comment when it ends
    this._setHideCommentTimer(__comment);
  }
  
}