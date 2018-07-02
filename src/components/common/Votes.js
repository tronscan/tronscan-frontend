import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {AddressLink, ExternalLink} from "./Links";
import {tu,t} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";

export default class Votes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      votes: [],
      page: 0,
      total: 0,
      pageSize: 25,
      totalVotes: 0,
      emptyState: props.emptyState,
    };
  }

  componentDidMount() {
    this.load();
  }

  onChange = (page, pageSize) => {
    this.load(page, pageSize);
  };

  load = async (page = 1, pageSize = 40) => {

    let {filter} = this.props;

    this.setState({ loading: true });

    let {votes, total, totalVotes} = await Client.getVotes({
      sort: '-votes',
      limit: pageSize,
      start: (page-1) * pageSize,
      ...filter,
    });

    this.setState({
      page,
      votes,
      total,
      totalVotes,
      loading: false,
    });
  };

  render() {

    let {votes, page, total, pageSize, totalVotes, loading, emptyState: EmptyState = null} = this.state;
    let {showCandidate = true, showVoter = true } = this.props;

    if (!loading && votes.length === 0) {
      if (!EmptyState) {
        return (
          <div className="p-3 text-center">{t("no_votes_found")}</div>
        );
      }
      return <EmptyState />;
    }

    return (
      <StickyContainer>
        {
          total > pageSize &&
            <Sticky>
              {
                ({style}) => (
                  <div style={{zIndex: 100, ...style}} className="card-body bg-white py-3 border-bottom">
                    <Paging onChange={this.onChange} total={total} loading={loading} pageSize={pageSize} page={page}/>
                  </div>
                )
              }
            </Sticky>
        }
        <table className="table table-hover m-0 border-top-0">
          <thead className="thead-dark">
          <tr>
            { showVoter && <th>{tu("voter")}</th> }
            { showCandidate && <th>{tu("candidate")}</th> }
            <th className="text-right" style={{width: 125 }}>{tu("votes")}</th>
            <th className="text-right" style={{width: 150 }}>{tu("voter_percentage")}</th>
            <th className="text-right" style={{width: 100 }}>{tu("percentage")}</th>
          </tr>
          </thead>
          <tbody>
          {
            votes.map((vote) => (
              <tr key={vote.id}>
                {
                  showCandidate &&
                    <td>
                      <ExternalLink url={vote.candidateUrl} /><br/>
                      <span className="small"><AddressLink address={vote.candidateAddress} /></span>
                    </td>
                }
                {
                  showVoter &&
                    <td>
                      <AddressLink address={vote.voterAddress} />
                    </td>
                }
                <td className="text-nowrap text-right">
                  <FormattedNumber value={vote.votes} />&nbsp;
                </td>
                <td className="text-nowrap text-right">
                  <FormattedNumber value={(vote.votes / (vote.voterAvailableVotes + vote.votes)) * 100} minimumFractionDigits={2} />%
                </td>
                <td className="text-nowrap text-right">
                  <FormattedNumber value={(vote.votes / totalVotes) * 100} minimumFractionDigits={2} />%
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </StickyContainer>
    )
  }
}
