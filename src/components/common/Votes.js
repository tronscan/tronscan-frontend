import React, {Fragment} from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {AddressLink, ExternalLink} from "./Links";
import {tu, t} from "../../utils/i18n";
import {ONE_TRX} from "../../constants";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "./loaders";
import {withTimers} from "../../utils/timing";

class Votes extends React.Component {

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

  load = async (page = 1, pageSize = 20) => {

    let {filter} = this.props;

    this.setState({loading: true});

    let {votes, total, totalVotes} = await Client.getVotes({
      sort: '-votes',
      limit: pageSize,
      start: (page - 1) * pageSize,
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
  customizedColumn = (filter) => {
    let {intl} = this.props;
    let {totalVotes} = this.state;
    let column_v = [
      {
        title: upperFirst(intl.formatMessage({id: 'voters'})),
        dataIndex: 'voterAddress',
        key: 'voterAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'votes'})),
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        width: '20%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'percentage'})),
        dataIndex: 'percentage',
        key: 'percentage',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Fragment><FormattedNumber value={(record.votes / totalVotes) * 100}
                                            minimumFractionDigits={2}/>%</Fragment>
        }
      },
    ];
    let column_c = [
      {
        title: upperFirst(intl.formatMessage({id: 'candidate'})),
        dataIndex: 'candidateAddress',
        key: 'candidateAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Fragment><ExternalLink url={record.candidateUrl}/>
            <span className="small"><AddressLink address={record.candidateAddress}/></span></Fragment>
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'candidate'})),
      //   dataIndex: 'candidateAddress',
      //   key: 'candidateAddress',
      //   align: 'left',
      //   className: 'ant_table',
      //   render: (text, record, index) => {
      //     return <Fragment><ExternalLink url={record.candidateUrl}/><br/>
      //       <span className="small"><AddressLink address={record.candidateAddress}/></span></Fragment>
      //   }
      // },
      
      {
        title: upperFirst(intl.formatMessage({id: 'votes'})),
        dataIndex: 'votes',
        key: 'votes',
        align: 'left',
        width: '20%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'voter_percentage'})),
        dataIndex: 'voter_percentage',
        key: 'voter_percentage',
        align: 'left',
        width: '20%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Fragment><FormattedNumber value={(record.votes / (record.voterAvailableVotes)) * 100}
                                            minimumFractionDigits={2}/>%</Fragment>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'percentage'})),
        dataIndex: 'percentage',
        key: 'percentage',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Fragment><FormattedNumber value={(record.votes / totalVotes) * 100}
                                            minimumFractionDigits={2}/>%</Fragment>
        }
      },
    ];

    if (filter.voter) {
      return column_c;
    }
    if (filter.candidate) {
      return column_v;
    }
  }

  render() {

    let {votes, page, total, pageSize, totalVotes, loading, emptyState: EmptyState = null} = this.state;
    let {showCandidate = true, showVoter = true, showVoterPercentage = true, filter} = this.props;

    let column = this.customizedColumn(filter);
    let {intl} = this.props;
    let tableInfo;
    if(filter.candidate) {
      tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'voter_unit'});
    }
    if(filter.voter){
      tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'vote_unit'});
    }

    if (!loading && votes.length === 0) {
      if (!EmptyState) {
        return (
            <div className="p-3 text-center no-data">{t("no_votes_found")}</div>
        );
      }
      return <EmptyState/>;
    }

    return (

        <div className="token_black table_pos">
          {loading && <div className="loading-style"><TronLoader/></div>}
          {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
          <SmartTable bordered={true} loading={loading} column={column} data={votes} total={total}
                      onPageChange={(page, pageSize) => {
                        this.load(page, pageSize)
                      }}/>
        </div>
    )
  }
}

export default injectIntl(Votes);