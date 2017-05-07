import ArrayUtil from '../utils/array';
import assign from 'object-assign';
import Header from './Header.react';
import MainSection from './MainSection.react';
import React, {Component} from 'react';
import SocialStore from '../stores/SocialStore';
import SocialActions from '../actions/SocialActions';

class SocialTracker extends Component {

  constructor(props) {
    super(props);
    this.state = assign({}, SocialStore.getState());
    this.renderFeed = this.renderFeed.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    SocialStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SocialStore.removeChangeListener(this._onChange);
  }

  render() {
    return (
        <div className="grid container">
          <Header/>
          <MainSection/>
          {this.renderFeed()}
        </div>
    );
  }

  renderFeed() {
    var feed = this.state.feed;
    var feedCollection = ArrayUtil.in_groups_of(feed, 3);
    if (feed.length > 0) {
      return feedCollection.map((feedGroup, index) => {
        return <div className="row" key={`${feedGroup[0].id}${index}`}>
          {feedGroup.map((feed) => {
            if (feed.type == 'tweet') {
              return <div className="col-md-4" key={feed.id}>
                <div className="well twitter">
                  <p>{feed.text}</p>
                </div>
              </div>;
            } else {
              var display = feed.selftext == "" ? `${feed.title}: ${feed.url}` : feed.selftext;
              return <div className="col-md-4" key={feed.id}>
                <div className="well reddit">
                  <p>{display}</p>
                </div>
              </div>;
            }
          })}
        </div>
      });
    } else {
      return <div></div>
    }
  }

  _onChange() {
    this.setState(SocialStore.getState());
  }

};

export default SocialTracker;
