/* eslint-disable no-undef */
import React from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {Client} from "../../services/api";
import {AddressLink} from "../common/Links";
import {Truncate} from "../common/text";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {upperFirst} from "lodash";
import {loadTokens} from "../../actions/tokens";

class Contracts extends React.Component {

  constructor() {
    super();

    this.state = {
      contracts: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.loadContracts();
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.loadContracts);
  }

  search = () => {
    console.log("searching");
  }
  loadContracts = async (page = 1, pageSize = 40) => {

    let result = await Client.getContracts({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize
    });
    console.log(result);
    this.setState({
      contracts: result.data,
      loading: false,
      total: result.total
    });
  };

  customizedColumn = () => {
    let {intl} = this.props;
    console.log(this.props)
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'address'})),
        dataIndex: 'address',
        key: 'address',
        align: 'left',
        className: 'ant_table',
        width: '200px',
        render: (text, record, index) => {
          return <Truncate>
                    <AddressLink address={text} isContract={true}>{text}</AddressLink>
                 </Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'ContractName'})),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'Compiler'})),
        dataIndex: 'compiler',
        key: 'compiler',
        align: 'left',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'balance'})),
        dataIndex: 'balance',
        key: 'balance',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'TxCount'})),
        dataIndex: 'trxCount',
        key: 'trxCount',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'value'})),
      //   dataIndex: 'trxAmount',
      //   key: 'trxAmount',
      //   align: 'left',
      //   className: 'ant_table',
      //   render: (text, record, index) => {
      //     return <FormattedNumber value={text}/>
      //   }
      // },
      {
        title: upperFirst(intl.formatMessage({id: 'Settings'})),
        dataIndex: 'isSetting',
        key: 'isSetting',
        align: 'left',
        width: '80px',
        className: 'ant_table',
        render: (text, record, index) => {
          return text? <span><i className="fa fa-cog"></i> <i className="fa fa-cog"></i> <i className="fa fa-cog"></i></span>: '-'
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'DateVerified'})),
        dataIndex: 'dateVerified',
        key: 'dateVerified',
        align: 'right',
        width: '170px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <div>
                  <FormattedDate value={text}/>{' '}
                  <FormattedTime value={text}/>
                </div>
        }
      }
    ];
    return column;
  }

  render() {

    let {contracts, total, loading} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'verified_contract_source_codes_found'})

    return (
      <main className="container header-overlap pb-3 token_black">
      {loading && <div className="loading-style"><TronLoader/></div>}
      <div className="row">
        <div className="col-md-12 table_pos">
          {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
          <SmartTable bordered={true} loading={loading}
                      column={column} data={contracts} total={total}
                      onPageChange={(page, pageSize) => {
                        this.loadContracts(page, pageSize)
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Contracts));
