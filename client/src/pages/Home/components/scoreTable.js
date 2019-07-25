import React, { Component } from 'react';
import { Table } from 'antd';

class ScoreTable extends Component {
  state = {
    data: [],
    column: [
      {
        key: 'hashtag',
        title: 'HashTag',
        dataIndex: 'hashtag',
        sorter: (a, b) => a['hashtag'].localeCompare(b['hashtag'])
      },
      {
        key: 'mean',
        title: 'HC score',
        dataIndex: 'mean',
        sorter: (a, b) => a['mean'] - b['mean']
      },
      {
        key: 'transfer-score',
        title: 'transfer score',
        dataIndex: 'transfer-score',
        sorter: (a, b) => a['transfer-score'] - b['transfer-score']
      }
    ]
  }
  
  componentDidMount () {
    const { hcItems } = this.props;
    let data = [];

    hcItems.forEach(item => {
      data.push({
        'hashtag': item['hashtag'],
        'mean': item['mean'].toFixed(2),
        'transfer-score': item['transfer-score'].toFixed(2),
      })
    });
    this.setState({ data: data });
  }

  render() {
    const { data, column } = this.state;

    return (
      <div className="Table">
        <Table
          rowKey="hc-item"
          dataSource={data}
          columns={column}
          pagination={false} 
        />;
      </div>
    );
  }
}

export default ScoreTable;