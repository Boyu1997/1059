import React, { Component } from 'react';

import { getHcItems, getHcScore } from '../../services/minervaApi.js';

import './styles.css';

class HomePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hcItems: []
    };

    Promise.all([
      getHcItems(this.props.token),
      getHcScore(this.props.token)
    ]).then(([items, scores]) => {
      // join hc and score by id
      let joinTable = {};
      items.forEach(item => {
        joinTable[item['id']] = item;
      });
      scores.forEach(score => {
        if (joinTable[score['hc-item']]) {
          Object.assign(joinTable[score['hc-item']], score);
        }
      });

      let hcItems = {
        "CS": {},
        "EA": {},
        "FA": {},
        "MC": {}
      };

      Object.keys(joinTable).forEach(key => {
        hcItems[joinTable[key]['cornerstone-code']][joinTable[key]['hc-item']] = joinTable[key];
        // {
        //   'id': item['id'],
        //   'name': item['name'],
        //   'hashtag': item['hashtag'],
        //   'description': item['description'],
        //   'paragraph': item['paragraph'],
        //   'examples': item['examples']
        // };
      });
      this.setState({ hcItems: hcItems });
    });
  }

  render() {
    return (
      <div className="Home-Page">
      </div>
    );
  }
}

export default HomePage;
