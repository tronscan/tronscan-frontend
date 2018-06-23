/* eslint-disable no-undef */
import React from "react";
import {connect} from "react-redux";
import {head, keyBy, max, maxBy, sortBy} from "lodash";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis} from "recharts";
import {Client} from "../../../services/api";
import {injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {tu} from "../../../utils/i18n";

class VoteStats extends React.Component {

  constructor() {
    super();

    this.state = {
      data: [],
      addresses: [],
      addressColors: {},
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {

  }

  loadData = async () => {

    let {intl, colors} = this.props;

    let data = await Client.getVoteStats();

    let stats = {};
    let addresses = {};

    for (let row of data) {
      if (!stats[row.timestamp]) {
        stats[row.timestamp] = [];
      }

      stats[row.timestamp].push({
        address: row.address,
        votes: row.votes,
      });

      addresses[row.address] = true;
    }

    let latestTimestamp = max(Object.keys(stats));

    let highestAddresses = keyBy(sortBy(stats[latestTimestamp], s => s.votes * -1).slice(0, 15), s => s.address);

    let i = 0;

    for (let address of Object.keys(highestAddresses)) {
      highestAddresses[address].color = colors[i++];
    }

    let rowStats = [];

    for (let [key, value] of Object.entries(stats)) {

      let row = {
        timestamp: key,
        datetime: intl.formatTime(parseInt(key)),
      };

      for (let entry of value) {
        if (typeof highestAddresses[entry.address] !== 'undefined') {
          row[entry.address] = entry.votes;
        }
      }

      rowStats.push(row);
    }

    rowStats = sortBy(rowStats, s => s.timestamp);

    this.setState({
      data: rowStats,
      addresses: Object.keys(highestAddresses),
      addressColors: highestAddresses,
    });
  };

  render() {

    let {data, addresses, addressColors} = this.state;

    if (data.length === 0) {
      return (
        <TronLoader>
          {tu("loading_votes")},
        </TronLoader>
      );
    }

    return (
      <div style={{height: 300}}>
        <ResponsiveContainer>
          <LineChart width={600} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}} isAnimationActive={false}>
            <XAxis dataKey="datetime"/>
            {/*<YAxis/>*/}
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            {/*<Tooltip/>*/}
            {
              addresses.map(address => (
                <Line key={address} type="monotone" dataKey={address} stroke={"#" + addressColors[address].color} activeDot={{r: 1}} isAnimationActive={false}/>
              ))
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

}


function mapStateToProps(state) {

  return {
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VoteStats));
