import React, {Fragment} from "react";
import { FormattedNumber, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {Client} from "../../services/api";
import {Truncate} from "../common/text";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {upperFirst, filter} from "lodash";
import {loadTokens} from "../../actions/tokens";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
// import TimeAgo from "react-timeago";
import moment from 'moment';
import {TRXPrice} from "../common/Price";
import {ONE_TRX} from "../../constants";
import BlockTime from '../common/blockTime'


class Contractinter extends React.Component {

    constructor() {
        super();
        this.state = {
            transfers: [],
            total: 0,
            "data": [
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "0bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee0",
                    "block": 1014113,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "1bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee1",
                    "block": 1014113,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "2bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee2",
                    "block": 1014113,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
                {
                    "id": "ace7dead-8d8f-4e6c-8e9b-7ae66d9dbebb",
                    "parentHash": "666bb1a86337fbe3fd18e6e6f3d0ea956d25716471940707b142b71fd84f5249ee2",
                    "block": 1014115,
                    "timestamp": 1532938269000,
                    "txType":"call",
                    "transferFromAddress": "TLRE3FWW68ARygPNaGHQ3tD6ut4czPJyQ9",
                    "transferToAddress": "TH5mDzehcYDaGCKdfbbkPCAWfPQSsuBAdH",
                    "amount": 10,
                    "tokenName": "BitPound",
                    "confirmed": false
                },
            ]
        };
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate() {
        //checkPageChanged(this, this.load);
    }
    onChange = (page,pageSize) => {
        this.load(page,pageSize);
    };
    load = async (page = 1, pageSize=40) => {

        let {location} = this.props;

        this.setState({ loading: true });

        let searchParams = {};
        let interData = this.state.data
        let interArr = []

        // for (let [key, value] of Object.entries(getQueryParams(location))) {
        //     switch (key) {
        //         case "address":
        //         case "block":
        //             searchParams[key] = value;
        //             break;
        //     }
        // }
        //
        let {total} = await Client.getTransfers({
            sort: '-timestamp',
            limit: pageSize,
            start: (page-1) * pageSize,
            ...searchParams,
        });

        let a = [];
        let b = [];
        let newArr = []
        for(let i in interData){
            a[i] = filter(interData , { 'block': interData[i]['block']})
            for(let key in a[i]){
                if(key>0 ){
                    a[i][key]['block'] = ''
                    a[i][key]['timestamp'] = ''
                }
            }
            b = b.concat(a[i]);
            newArr = Array.from(new Set(b))
        }
        this.setState({
            transfers:newArr,
            loading: false,
            total
        });
    };
    customizedColumn = () => {
        let {intl} = this.props;
        let column = [
          {
            title: upperFirst(intl.formatMessage({id: 'block'})),
            dataIndex: 'block',
            key: 'block',
            align: 'left',
            width: '100px',
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
            width: '120px',
            className: 'ant_table',
            render: (text, record, index) => {
              return <BlockTime time={text}></BlockTime>
              // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'parent_hash'})),
            dataIndex: 'transactionHash',
            key: 'transactionHash',
            align: 'left',
            render: (text, record, index) => {
              return <Truncate>
                        <TransactionHashLink hash={text}>{text}</TransactionHashLink>
                     </Truncate>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'inter_type'})),
            dataIndex: 'inter_type',
            key: 'inter_type',
            align: 'left',
            className: 'ant_table',
            render: (text, record, index) => {
              return <span>cell</span>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'from'})),
            dataIndex: 'transferFromAddress',
            key: 'transferFromAddress',
            align: 'left',
            className: 'ant_table',
            render: (text, record, index) => {
              return  <AddressLink address={text} />
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'to'})),
            dataIndex: 'transferToAddress',
            key: 'transferToAddress',
            align: 'left',
            className: 'ant_table',
            render: (text, record, index) => {
              return <AddressLink address={text} />
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'value'})),
            dataIndex: 'isSetting',
            key: 'isSetting',
            align: 'right',
            width: '120px',
            className: 'ant_table',
            render: (text, record, index) => {
                return  <span>{
                            record.tokenName.toUpperCase() === 'TRX' ?
                            <Fragment>
                                <TRXPrice amount={record.amount / ONE_TRX}/>
                            </Fragment> :
                            <Fragment>
                                <FormattedNumber value={record.amount}/> {record.tokenName}
                            </Fragment>
                        }</span>
            }
          }
        ];
        return column;
      }
    
      render() {
    
        let {transfers, total, loading} = this.state;
        let {match, intl} = this.props;
        let column = this.customizedColumn();
        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'inter_contract_unit'})
    
        return (
          <main className="container header-overlap pb-3 token_black">
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="row">
            <div className="col-md-12 table_pos">
              {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
              <SmartTable bordered={true} loading={loading}
                          column={column} data={transfers} total={total}
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
    return {
    };
}

const mapDispatchToProps = {
    loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Contractinter));
