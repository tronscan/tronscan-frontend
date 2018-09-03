import React, {Fragment} from "react";
import {Client} from "../../../services/api";
import {AddressLink, TransactionHashLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {ONE_TRX} from "../../../constants";
import {tu} from "../../../utils/i18n";
import TimeAgo from "react-timeago";
import {Truncate} from "../../common/text";
import {withTimers} from "../../../utils/timing";
import {FormattedNumber, injectIntl} from "react-intl";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "../../common/loaders";

class Transfers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      transfers: [],
      page: 0,
      total: 0,
      pageSize: 25,
      showTotal: props.showTotal !== false,
      emptyState: props.emptyState,
      autoRefresh: props.autoRefresh || false
    };
  }

  componentDidMount() {
    this.loadPage();

    if (this.state.autoRefresh !== false) {
      this.props.setInterval(() => this.load(), this.state.autoRefresh);
    }
  }

  onChange = (page, pageSize) => {
    this.loadPage(page, pageSize);
  };

  loadPage = async (page = 1, pageSize = 10) => {

    let {filter} = this.props;

    let {showTotal} = this.state;

    this.setState({loading: true});

    let {transfers, total} = await Client.getTransfers({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      count: showTotal ? true : null,
      ...filter,
    });

    for (let index in transfers) {
      transfers[index].index = parseInt(index) + 1;
    }

    this.setState({
      page,
      transfers,
      total,
      loading: false,
    });
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'hash'})),
        dataIndex: 'transactionHash',
        key: 'transactionHash',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
            <TransactionHashLink hash={record.transactionHash}>
              {record.transactionHash}
            </TransactionHashLink>
          </Truncate>

        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'age'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        width: '16%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <TimeAgo date={record.timestamp}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'transferFromAddress',
        key: 'transferFromAddress',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={record.transferFromAddress}/>
        }
      },
      {
        title: '',
        className: 'ant_table',
        width: '30px',
        render: (text, record, index) => {
          return <img src={require("../../../images/arrow.png")}/>
        },
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'transferToAddress',
        key: 'transferToAddress',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={record.transferToAddress}/>
        },
      },
      {
        title: upperFirst(intl.formatMessage({id: 'amount'})),
        dataIndex: 'amount',
        key: 'amount',
        width: '20%',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <div>{record.tokenName === "TRX" ?
              <TRXPrice amount={record.amount / ONE_TRX}/> :
              <span><FormattedNumber value={record.amount}/> {record.tokenName}</span>}
          </div>

        },
      }

    ];

    return column;
  }

  render() {

    let {transfers, page, total, pageSize, loading, emptyState: EmptyState = null} = this.state;
    let {theadClass = "thead-dark"} = this.props;
    let column = this.customizedColumn();
    if (!loading && transfers.length === 0) {
      if (!EmptyState) {
        return (
            <div className="p-3 text-center">{tu("no_transfers")}</div>
        );
      }

      return <EmptyState/>;
    }

    return (
        <Fragment>
        {loading && <div className="loading-style"><TronLoader/></div>}
        <div className="row transfers">
          <div className="col-md-12">
            <SmartTable border={false} loading={loading} column={column} data={transfers} total={total}
                        onPageChange={(page, pageSize) => {
                          this.loadPage(page, pageSize)
                        }}/>
          </div>
        </div>
        </Fragment>
    )
  }
}

export default withTimers(injectIntl(Transfers));
