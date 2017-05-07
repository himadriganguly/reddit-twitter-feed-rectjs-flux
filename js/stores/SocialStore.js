import AppDispatcher from '../dispatcher/AppDispatcher';
import SocialConstants from '../constants/SocialConstants';
import EventEmitter from 'events';
import assign from 'object-assign';
import _ from 'underscore';

var CHANGE_EVENT = 'change';

var _state = {
  tweets: [],
  reddits: [],
  feed: [],
  showTweets: true,
  showReddits: true
};

function updateState(state) {
  _state = assign({}, _state, state);
}

function mergeFeed(tweets, reddits, showTweets, showReddits) {
  let mergedFeed = [];
  mergedFeed = showTweets ? mergedFeed.concat(tweets) : mergedFeed;
  mergedFeed = showReddits ? mergedFeed.concat(reddits) : mergedFeed;

  mergedFeed = _.sortBy(mergedFeed, (feedItem) => {
    if (feedItem.type == 'tweet') {
      let date = new Date(feedItem.created_at);
      return date.getTime();
    } else if ((feedItem.type == 'reddit')) {
      return feedItem.created_utc * 1000;
    }
  })
  return mergedFeed;
};


var SocialStore = assign({}, EventEmitter.prototype, {

  getState() {
    return _state;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function (action) {
  switch (action.type) {

    case SocialConstants.FILTER_BY_TWEETS:
      updateState({
        showTweets: action.showTweets,
        feed: mergeFeed(_state.tweets, _state.reddits, action.showTweets, _state.showReddits)
      });
      SocialStore.emitChange();
      break;
    case SocialConstants.FILTER_BY_REDDITS:
      updateState({
        showReddits: action.showReddits,
        feed: mergeFeed(_state.tweets, _state.reddits, _state.showTweets, action.showReddits)
      });
      SocialStore.emitChange();
      break;
    case SocialConstants.SYNC_TWEETS:
      updateState({
        tweets: action.tweets,
        feed: mergeFeed(action.tweets, _state.reddits, _state.showTweets, _state.showReddits)
      });
      SocialStore.emitChange();
      break;
    case SocialConstants.SYNC_REDDITS:
      updateState({
        reddits: action.reddits,
        feed: mergeFeed(_state.tweets, action.reddits, _state.showTweets, _state.showReddits)
      });
      SocialStore.emitChange();
      break;
    default:
    // no op
  }
});

export default SocialStore;
