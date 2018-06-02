import React from "react";
import {TimeAgo} from "react-timeago";
import {FormattedNumber} from "react-intl";
import {filter, find, isNaN, isNumber, keyBy, last, random, range, sortBy, sumBy, trim} from "lodash";
import {connect} from "react-redux";
import {reloadWallet} from "../../actions/wallet";
import {withTimers} from "../utils/timing";
import FlipMove from "react-flip-move";
import Avatar from "../common/Avatar";
import {Client} from "../../services/api";
import {AddressLink} from "../common/Links";
import palette from "google-palette";
import VoteStats from "../blockchain/Statistics/VoteStats";

function VoteChange({value, arrow = false}) {
  if (value > 0) {
    return (
      <span className="text-success">
        <span className="mr-1">+{value}</span>
        { arrow && <i className="fa fa-arrow-up" /> }
      </span>
    )
  }

  if (value < 0) {
    return (
      <span className="text-danger">
        <span className="mr-1">{value}</span>
        { arrow && <i className="fa fa-arrow-down" /> }
      </span>
      )
  }

  return (
    <span>
      -
    </span>
  )
}

class VoteLive extends React.Component {

  constructor() {
    super();
    this.state = {
      candidates: [],
      votes: {},
      colors: palette('mpn65', 20),
    };
  }

  componentDidMount() {

    this.loadCandidates()
      .then(() => this.loadVotes());

    this.props.setInterval(() => {
      this.loadVotes();
      this.loadCandidates();
    }, 15000);
  }

  loadCandidates = async () => {
    let {witnesses} = await Client.getWitnesses();

    this.setState({
      candidates: witnesses.map(c => ({
        ...c,
        votes: 0,
      })),
    });
  };

  loadVotes = async () => {
    let votes = await Client.getLiveVotes();

    this.setState({
      votes,
    });
  };

  render() {

    let {candidates, colors, votes} = this.state;

    candidates = candidates.map(c => ({
      ...c,
      votes: (votes[c.address] ? votes[c.address].votes : 0),
    }));

    let newCandidates = sortBy(candidates, c => c.votes * -1).map((c, index) => ({
      ...c,
      rank: index + 1,
    }));

    return (
      <main className="container header-overlap pb-3">
        <div className="card">
          <div className="card-header text-center">
            3 Days Ranking
          </div>
          <VoteStats colors={colors} />
        </div>
        <div className="card mt-3">
          <div className="card-header text-center">
            Live Ranking
          </div>
          <div className="media m-3 mb-0">
            <div className="font-weight-bold text-center border-1 border-secondary" style={{ width: 25 }}>
              &nbsp;
            </div>
            <div className="mx-2" style={{width: 25}}>
              &nbsp;
            </div>
            <div className="media-body font-weight-bold">
              Candidate
            </div>
            <div className="ml-3 text-center font-weight-bold">
              Current Votes
            </div>
          </div>
          <FlipMove
            duration={700}
            easing="ease"
            enterAnimation="elevator"
            staggerDurationBy={15}
            staggerDelayBy={20}>

          {
            newCandidates.map((candidate, index) => (
              <div key={candidate.address} className="media mx-3 mb-3">
                <div className="font-weight-bold text-center border-1 border-secondary" style={{color: index < 15 ? '#' + colors[index] : null, ...style.rank}}>
                    {candidate.rank}
                </div>
                <div className="mx-2">
                  <Avatar value={candidate.address} size={style.avatar.height} />
                </div>
                <div className="media-body">
                  <span className="mt-0" style={style.row}>
                    <AddressLink address={candidate.name || candidate.url} />
                  </span>
                </div>
                <div className="ml-3 text-center">
                  {/*<div className="text-muted">Votes</div>*/}
                  <div style={style.votes}>
                    <FormattedNumber value={candidate.votes} />
                  </div>
                </div>
              </div>
            ))
          }
          </FlipMove>
        </div>
      </main>
    );
  }
}

let height = 25;

const style = {
  rank: {
    fontSize: 18,
    lineHeight: `${height}px`,
    borderRadius: '6px',
    width: '25px'
  },
  votes: {
    fontSize: 18,
    lineHeight: `${height}px`,
  },
  row: {
    lineHeight: `${height}px`,
    fontSize: 18,
  },
  avatar: {
    height: height,
  }
};

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens,
    wallet: state.wallet,
    flags: state.app.flags,
  };
}

const mapDispatchToProps = {
  reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(withTimers(VoteLive)))

