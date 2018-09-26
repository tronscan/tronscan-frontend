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
import {upperFirst} from "lodash";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {TRXPrice} from "../common/Price";
import {ONE_TRX} from "../../constants";

class Transfers extends React.Component {

  constructor() {
    super();

    this.state = {
      transfers: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.load);
  }

  onChange = (page, pageSize) => {
    this.load(page, pageSize);
  };
  load = async (page = 1, pageSize = 20) => {

    let {location} = this.props;

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

    let {transfers, total} = await Client.getTransfers({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...searchParams,
    });

    this.setState({
      transfers,
      loading: false,
      total
    });
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'transactionHash',
        key: 'transactionHash',
        align: 'left',
        className: 'ant_table',
        width: '15%',
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
        width: '10%',
        render: (text, record, index) => {
          return <BlockNumberLink number={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'created'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        align: 'left',
        width: '14%',
        render: (text, record, index) => {
          return <TimeAgo date={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'transferFromAddress',
        key: 'transferFromAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'transferToAddress',
        key: 'transferToAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'value'})),
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: '180px',
        className: 'ant_table',
        render: (text, record, index) => {
          return record.tokenName == 'TRX'? 
                  <TRXPrice amount={record.amount / ONE_TRX}/>
                  :record.amount + ' ' + record.tokenName

        }
      }
    ];
    return column;
  }

  render() {

    let {transfers, total, loading} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transfers_unit'})

    return (
        <main className="container header-overlap pb-3 token_black">
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="row">
            <div className="col-md-12 table_pos">
              {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
              <SmartTable bordered={true} loading={loading} column={column} data={transfers} total={total}
                          onPageChange={(page, pageSize) => {
                            this.load(page, pageSize)
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Transfers));
