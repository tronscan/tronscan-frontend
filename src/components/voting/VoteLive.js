import React from "react";
import {FormattedNumber} from "react-intl";
import {sortBy} from "lodash";
import {withTimers} from "../../utils/timing";
import FlipMove from "react-flip-move";
import {Client} from "../../services/api";
import {AddressLink} from "../common/Links";
import palette from "google-palette";
import {tu} from "../../utils/i18n"


class VoteLive extends React.Component {

  constructor() {
    super();
    this.state = {
      candidates: [],
      data: null,
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

    this.loadData();
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
  loadData = async () => {

    let data = await Client.getVoteStats();
    this.setState({
      data,
    });
  }

  render() {

    let {candidates, colors, votes, data} = this.state;

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
          <div className="card mt-3">
            <div className="card-header text-center">
              {tu("live_ranking")}
              <div className="small text-center text-muted p-2">
                {tu("live_ranking_msg")}
              </div>
            </div>
            <div className="media m-3 mb-0">
              <div className="font-weight-bold text-center border-1 border-secondary" style={{width: 25}}>
                &nbsp;
              </div>
              <div className="mx-2" style={{width: 25}}>
                &nbsp;
              </div>
              <div className="media-body font-weight-bold">
                {tu("candidate")}
              </div>
              <div className="ml-3 text-center font-weight-bold">
                {tu("current_votes")}
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
                      <div className="font-weight-bold text-center border-1 border-secondary"
                           style={{color: index < 15 ? '#' + colors[index] : null, ...style.rank}}>
                        {candidate.rank}
                      </div>

                      <div className="media-body">
                  <span className="mt-0" style={style.row}>
                    <AddressLink address={candidate.address}>
                      {candidate.name || candidate.url}
                    </AddressLink>
                  </span>
                      </div>
                      <div className="ml-3 text-center">
                        {/*<div className="text-muted">Votes</div>*/}
                        <div style={style.votes}>
                          <code style={{color: '#3E3F3A'}}>
                            <FormattedNumber value={candidate.votes}/>
                          </code>
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
    width: '45px'
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

export default withTimers(VoteLive);

