import React, { Component } from 'react';

import { getHcItems, getHcScores, getAllSections, getHcPerformances } from '../../services/minervaApi.js';
import { calculatePerformance } from '../../services/hcCalculation';

import { Collapse } from 'antd';

import ScoreTable from './components/scoreTable.js';

import './styles.css';

const { Panel } = Collapse;

class HomePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sections: JSON.parse(sessionStorage.getItem('sections')),
      hcItems: JSON.parse(sessionStorage.getItem('hcItems'))
    };

    if (!this.state.sections || !this.state.hcItems) {
      Promise.all([
        getHcItems(this.props.token),
        getHcScores(this.props.token),
        getAllSections(this.props.token)
      ]).then(([items, scores, sections]) => {

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

        this.setState({ sections: sections });
        sessionStorage.setItem('sections', JSON.stringify(sections));
        return joinTable;

      }).then((joinTable) => {

        // fetch performance for all hc
        Promise.all(Object.keys(joinTable).map(key => {
          return getHcPerformances(this.props.token, joinTable[key]['hc-item']);

        })).then((performances) => {

          // join performance info to table
          Object.keys(joinTable).forEach((key, index) => {
            Object.assign(joinTable[key], {'performances': performances[index]});
          });
          
          // convert to list and keep only useful info
          let hcList = [];
          Object.keys(joinTable).forEach(key => {
            hcList.push(joinTable[key]);
          });

          return hcList;
        }).then((hcList) => {
          Promise.all(hcList.map(hc => {
            return Promise.all(hc['performances'].map(performance => {
              return calculatePerformance(this.props.token, performance, hc['hashtag'], hc['cornerstone-code'], this.state.sections);
            }));
          })).then((performances) => {
            
            // replace new performance info to table
            hcList.forEach((hc, index) => {
              hc['performances'] = performances[index];
            });
            return hcList;
          }).then(hcList => {
            hcList.forEach(hc => {
              const x = hc['performances'].map(p => {
                if (p['foregrounded']) {
                  return 0;
                }
                else if (p['score'] >= 3) {
                  return p['weight'];
                }
                else {
                  return -p['weight'];
                }
              }).reduce((a,b) => a + b, 0);
              const alpha = 0.385;
              const mu = 0.2;
              const n = 28;   // n is hard-coded as 28, ideally, it should be dynamically calculated base on num of class taken
              const v = 1.818;
              hc['transfer-score'] = 1 + 4 / Math.pow((1 + Math.exp(-alpha * (x - mu * n))), v);
              hc['x'] = x
            });
  
            // convert table into
            let hcItems = {
              "CS": [],
              "EA": [],
              "FA": [],
              "MC": []
            };
  
            hcList.forEach(hc => {
              hcItems[hc['cornerstone-code']].push({
                'cornerstone-code': hc['cornerstone-code'],
                'description': hc['description'],
                'examples': hc['examples'],
                'hashtag': hc['hashtag'],
                'hc-item': hc['hc-item'],
                'mean': hc['mean'],
                'name': hc['name'],
                'paragraph': hc['paragraph'],
                'performances': hc['performances'],
                'transfer-score': hc['transfer-score'],
                'x': hc['x']
              });
            });

            // set state and store cache
            this.setState({ hcItems: hcItems });
            sessionStorage.setItem('hcItems', JSON.stringify(hcItems));

          });
        });
      });
    }
  }

  render() {
    const { hcItems } = this.state;
    return (
      <div className="Home-Page">

        {hcItems ?
          <Collapse>
            <Panel header="Multimodal Communications" key="1">
              <ScoreTable
                hcItems={hcItems['MC']}
              />
            </Panel>
            <Panel header="Empirical Analyses" key="2">
              <ScoreTable
                hcItems={hcItems['EA']}
              />
            </Panel>
            <Panel header="Formal Analyses" key="3">
              <ScoreTable
                hcItems={hcItems['FA']}
              />
            </Panel>
            <Panel header="Complex Systems" key="4">
              <ScoreTable
                hcItems={hcItems['CS']}
              />
            </Panel>
          </Collapse>
        :
          <div>
            <h2>Do NOT Reload!</h2>
            <div>Querying data from ALF, this will take 2-5 minutes.</div>
          </div>
        }
      </div>
    );
  }
}

export default HomePage;
