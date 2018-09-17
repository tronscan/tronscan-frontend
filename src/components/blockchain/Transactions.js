/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import TimeAgo from "react-timeago";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import {getQueryParams} from "../../utils/url";
import {Truncate} from "../common/text";
import {ContractTypes} from "../../utils/protocol";
import {upperFirst} from "lodash";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";

class Transactions extends React.Component {

  constructor() {
    super();

    this.state = {
      transactions: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.loadTransactions();
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.loadTransactions);
  }

  onChange = (page, pageSize) => {
    this.loadTransactions(page, pageSize);
  };

  loadTransactions = async (page = 1, pageSize = 20) => {

    let {location, match} = this.props;
    let date_to = match.params.date;
    let date_start = parseInt(match.params.date) - 24 * 60 * 60 * 1000;

    this.setState({loading: true});

    let searchParams = {};

    for (let [key, value] of Object.entries(getQueryParams(location))) {
      switch (key) {
        case "address":
        case "block":
          searchParams[key] = value;
          break;
      }
    }
    let result = null;
    if (date_start) {
      result = await Client.getTransactions({
        sort: '-timestamp',
        date_start: date_start,
        date_to: date_to
      });
    }
    else {
      result = await Client.getTransactions({
        sort: '-timestamp',
        limit: pageSize,
        start: (page - 1) * pageSize,
        ...searchParams,
      });
    }
    this.setState({
      transactions: result.transactions,
      loading: false,
      total: result.total
    });
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'hash',
        key: 'hash',
        align: 'left',
        className: 'ant_table',
        width: '12%',
        render: (text, record, index) => {
          return <Truncate>
            <TransactionHashLink hash={text}>{text}</TransactionHashLink>
          </Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'block'})),
        dataIndex: 'block',
        key: 'block',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <BlockNumberLink number={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'created'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        align: 'left',
        render: (text, record, index) => {
          return <TimeAgo date={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'address'})),
        dataIndex: 'ownerAddress',
        key: 'ownerAddress',
        align: 'left',
        width: '40%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'contract'})),
        dataIndex: 'contractType',
        key: 'contractType',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <span>{ContractTypes[text]}</span>
        },
      }
    ];
    return column;
  }

  render() {

    let {transactions, total, loading} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transactions_unit'})

    return (
        <main className="container header-overlap pb-3 token_black">
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="row">
            <div className="col-md-12 table_pos">
              {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
              <SmartTable bordered={true} loading={loading}
                          column={column} data={transactions} total={total}
                          onPageChange={(page, pageSize) => {
                            this.loadTransactions(page, pageSize)
                          }}/>
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {

  return {};
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Transactions));
