import React, { Component } from 'react';

import { getHcItems, getHcScores, getHcPerformance } from '../../services/minervaApi.js';

import './styles.css';

class HomePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hcItems: []
    };

    Promise.all([
      getHcItems(this.props.token),
      getHcScores(this.props.token)
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
      return joinTable;

    }).then((joinTable) => {

      // fetch performance for all hc
      Promise.all(Object.keys(joinTable).map(key => {
        return getHcPerformance(this.props.token, joinTable[key]['hc-item']);

      })).then((performances) => {

        // join performance info to table
        Object.keys(joinTable).forEach((key, index) => {
          Object.assign(joinTable[key], {'performances': performances[index]});
        });

        // convert table into
        let hcItems = {
          "CS": {},
          "EA": {},
          "FA": {},
          "MC": {}
        };

        Object.keys(joinTable).forEach(key => {
          hcItems[joinTable[key]['cornerstone-code']][joinTable[key]['hc-item']] = {
            'cornerstone-code': joinTable[key]['cornerstone-code'],
            'description': joinTable[key]['description'],
            'examples': joinTable[key]['examples'],
            'hashtag': joinTable[key]['hashtag'],
            'hc-item': joinTable[key]['hc-item'],
            'mean': joinTable[key]['mean'],
            'name': joinTable[key]['name'],
            'paragraph': joinTable[key]['paragraph'],
            'performances': joinTable[key]['performances'].map((performance) => {
              return {
                'weight': (performance['assignment'] && performance['assignment']['weight'] ? performance['assignment']['weight'] : 1),
                'score': performance['score']
              }
            })
          };
        });
        this.setState({ hcItems: hcItems });
      });
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
