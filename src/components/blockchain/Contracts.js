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
import xhr from "axios/index";
import {API_URL} from "../../constants";
import {TRXPrice} from "../common/Price";
import { ONE_TRX} from "../../constants";

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

  loadContracts = async (page = 1, pageSize = 20) => {
    xhr({
      baseURL: 'http://18.216.57.65:20111',
      url: `/api/contracts`,
      method:'get',
      params: {
        confirm: 0,
        sort: '-timestamp',
        limit: pageSize,
        start: (page - 1) * pageSize
      }
      
    }).then((result) => {
      if (result.data.data) {
        this.setState({
          contracts: result.data.data,
          loading: false,
          total: result.data.total
        });
      }
    });
    
  };

  customizedColumn = () => {
    let {intl} = this.props;
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
          return <TRXPrice amount={parseInt(text) / ONE_TRX}/>
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
      {
        title: upperFirst(intl.formatMessage({id: 'Settings'})),
        dataIndex: 'isSetting',
        key: 'isSetting',
        align: 'left',
        width: '90px',
        className: 'ant_table',
        render: (text, record, index) => {
          return (
          <span>
            {record.isLibrary && <i className="fa fa-columns mx-1"></i> }
            {record.isSetting && <i className="fa fa-bolt mx-1"></i> }
            {record.isParameter && <i className="fa fa-wrench mx-1"></i> }
            {(!record.isLibrary && !record.isSetting && !record.isParameter) && '-' }
          </span>)
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
