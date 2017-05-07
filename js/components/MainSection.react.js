import React, {Component} from 'react';
import assign from 'object-assign';
import SocialActions from '../actions/SocialActions';
import SocialStore from '../stores/SocialStore';

class MainSection extends Component {

  constructor(props) {
    super(props);
    this.state = assign({twitter: 'twitter', reddit: 'twitter'}, SocialStore.getState());
    this.changeTwitterSource = this.changeTwitterSource.bind(this);
    this.changeRedditSource = this.changeRedditSource.bind(this);
    this.syncFeed = this.syncFeed.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    SocialStore.addChangeListener(this._onChange);
    this.syncFeed();
  }

  componentWillUnmount() {
    SocialStore.removeChangeListener(this._onChange);
  }

  render() {
    return(
      <div className="row">
        <div className="col-xs-8 col-md-8 col-md-offset-2">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Feed Type</th>
                <th>Feed Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="checkbox">
                    <label>
                      <input id="twitter" type="checkbox" onChange={SocialActions.filterTweets}
                        checked={this.state.showTweets} /> Twitter
                    </label>
                  </div>
                </td>
                <td>
                  <div className="input-group">
                    <div className="input-group-addon">@</div>
                    <input id="twitter-username" type="text" className="form-control" onChange={this.changeTwitterSource} value={this.state.twitter} />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="checkbox">
                    <label>
                      <input id="reddit" type="checkbox" onChange={SocialActions.filterReddits}
                        checked={this.state.showReddits} /> Reddit
                    </label>
                  </div>
                </td>
                <td>
                  <div className="input-group">
                    <div className="input-group-addon">@</div>
                    <input id="reddit-username" type="text" className="form-control" onChange={this.changeRedditSource} value={this.state.reddit} />
                  </div>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <button type="submit" className="btn btn-primary btn-lg" onClick={this.syncFeed}>Sync Feed</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  changeTwitterSource(event) {
    this.setState({twitter: event.target.value});
  }

  changeRedditSource(event) {
    this.setState({reddit: event.target.value});
  }

  syncFeed() {
    SocialActions.fetchReddits(this.state.reddit);
    SocialActions.fetchTweets(this.state.twitter);
  }

  _onChange() {
    this.setState(SocialStore.getState());
  }

};

export default MainSection;
