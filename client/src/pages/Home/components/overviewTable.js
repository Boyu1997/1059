import React, { Component } from 'react';
import { Table } from 'antd';

class OverviewTable extends Component {
  state = {
    data: [],
    column: [
      {
        key: 'course',
        title: 'Course',
        dataIndex: 'course'
      },
      {
        key: 'hcScore',
        title: 'HC Mastery Score (60%)',
        dataIndex: 'hcScore'
      },
      {
        key: 'transferScope',
        title: 'Transfer Scope (25%)',
        dataIndex: 'transferScope'
      },
      {
        key: 'transferCompetence',
        title: 'Transfer Competence (15%)',
        dataIndex: 'transferCompetence'
      },
      {
        key: 'composite',
        title: 'Composite (100%)',
        dataIndex: 'composite'
      },
      {
        key: 'letterGrade',
        title: 'Letter Grade',
        dataIndex: 'letterGrade'
      }
    ]
  }

  componentDidMount () {
    const { overallScore } = this.props;
    console.log(overallScore);
    let data = [];

    if (overallScore != null) {
      ['CS', 'EA', 'FA', 'MC'].forEach((key) => {
        const scores = overallScore[key];
        data.push({
          'course': key,
          'hcScore': scores.hcScore.toFixed(2),
          'transferScope': scores.transferScope.toFixed(2),
          'transferCompetence': scores.transferCompetence.toFixed(2),
          'composite': scores.composite.toFixed(2),
          'letterGrade': scores.letterGrade
        });
      });
    }

    this.setState({ data: data });
  }

  render() {
    const { data, column } = this.state;

    return (
      <div className="Table">
        <Table
          rowKey="course"
          dataSource={data}
          columns={column}
          pagination={false}
        />;
      </div>
    );
  }
}

export default OverviewTable;
