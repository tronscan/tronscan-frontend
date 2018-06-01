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
    };
  }

  componentDidMount() {

    this.loadCandidates()
      .then(() => this.loadVotes());

    this.props.setInterval(() => {
      this.loadVotes();
    }, 10000);
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
    let {candidates} = this.state;
    let votes = await Client.getLiveVotes();

    let candidatesMap = keyBy(candidates, c => c.address);

    console.log(votes, candidates, candidatesMap);

    for (let address of Object.keys(votes)) {
      console.log("ADDRESS", address, candidatesMap[address], votes[address]);
      if (candidatesMap[address]) {
        candidatesMap[address].votes = votes[address].votes;
      }
    }

    this.setState({
      votes,
      candidates: Object.values(candidatesMap),
    });
  };

  render() {

    let {candidates} = this.state;

    let newCandidates = sortBy(candidates, c => c.votes * -1).map((c, index) => ({
      ...c,
      rank: index + 1,
    }));

    return (
      <main className="container header-overlap pb-3">
        <div className="card">
          <FlipMove
            duration={700}
            easing="ease"
            enterAnimation="elevator"
            staggerDurationBy={15}
            staggerDelayBy={20}>

          {
            newCandidates.map((candidate) => (
              <div key={candidate.address} className="media m-3">
                <div className="font-weight-bold text-center border-1 border-secondary" style={style.rank}>
                    {candidate.rank}
                  </div>
                <div className="mx-2">
                  <Avatar value={candidate.address} size={style.avatar.height} />
                </div>
                <div className="media-body">
                  <h5 className="mt-0" style={style.row}>
                    <AddressLink address={candidate.name || candidate.url} />
                  </h5>

                </div>
                <div className="ml-3 text-center">
                  {/*<div className="text-muted">Votes</div>*/}
                  <div className="font-weight-bold" style={style.votes}>
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

let height = 100;

const style = {
  rank: {
    fontSize: 28,
    lineHeight: `${height}px`,
    borderRadius: '6px',
    width: '65px'
  },
  votes: {
    fontSize: 18,
    lineHeight: `${height}px`,
  },
  row: {
    lineHeight: `${height}px`,
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

