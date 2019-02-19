import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import SweetAlert from "react-bootstrap-sweetalert";
import {t, tu} from "../../../utils/i18n";
import {trim} from "lodash";
import {Client} from "../../../services/api";
import {TokenTRC20Link ,AddressLink} from "../../common/Links";
import {getQueryParam} from "../../../utils/url";
import SearchInput from "../../../utils/SearchInput";
import {toastr} from 'react-redux-toastr'
import SmartTable from "../../common/SmartTable.js"
import {API_URL, ONE_TRX} from "../../../constants";
import {login} from "../../../actions/app";
import {reloadWallet} from "../../../actions/wallet";
import {upperFirst, toLower} from "lodash";
import {TronLoader} from "../../common/loaders";
import {Link} from "react-router-dom";
import xhr from "axios/index";


class TokenList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
            buyAmount: 0,
            loading: false,
            total: 0,
            filter: {},
        };

        let nameQuery = trim(getQueryParam(props.location, "search"));
        if (nameQuery.length > 0) {
            this.state.filter.name = `%25${nameQuery}%25`;
        }
    }

    loadPage = async (page = 1, pageSize = 20) => {
        let {filter} = this.state;
        let {intl} = this.props;
        this.setState({loading: true});
        let token;
        let result;
        let total

        if (filter.name){
            result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&limit=" + pageSize + "&start=" + (page - 1) * pageSize + "&name=" + filter.name);
            total = result.data['trc20_tokens'].length;
        }else{
            result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&limit=" + pageSize + "&start=" + (page - 1) * pageSize);
            total = result.data['total'];
        }

        let tokens = result.data['trc20_tokens'];
        tokens.map((item,index) =>{
            item.index = index + 1 +(page - 1) * pageSize
        })

        // if (tokens.length === 0) {
        //     toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'record_not_found'}));
        // }

        this.setState({
            loading: false,
            tokens,
            total,
        });
        return total;
    };

    componentDidMount() {
        this.loadPage();
    }

    setSearch = () => {
        let nameQuery = trim(getQueryParam(this.props.location, "search"));
        if (nameQuery.length > 0) {
            this.setState({
                filter: {
                    name: `%25${nameQuery}%25`,
                }
            });
        } else {
            this.setState({
                filter: {},
            });
        }
    };

    componentDidUpdate(prevProps, prevState) {
        // if (this.props.location !== prevProps.location) {
        //     this.setSearch();
        // }
        // if (this.state.filter !== prevState.filter) {
        //     this.loadPage();
        // }
    }

    onChange = (page, pageSize) => {
        this.loadPage(page, pageSize);
    };

    customizedColumn = () => {
        let {intl} = this.props;
        let column = [
            {
                title: '#',
                dataIndex: 'index',
                key: 'index',
                width: '48px',
                align: 'center',
                className: 'ant_table _text_nowrap',
            },
            {
                title: upperFirst(intl.formatMessage({id: 'token'})),
                dataIndex: 'name',
                key: 'name',
                width: '50%',
                render: (text, record, index) => {
                    return <div className="table-imgtext">
                        {record.icon_url ?
                            <div style={{width: '42px', height: '42px', marginRight: '18px'}}><img
                                style={{width: '42px', height: '42px'}} src={record.icon_url}/></div> :
                            <div style={{width: '42px', height: '42px', marginRight: '18px'}}><img
                                style={{width: '42px', height: '42px'}} src={require('../../../images/logo_default.png')}/></div>
                        }

                        <div>
                            <h5><TokenTRC20Link name={record.name}
                                           namePlus={record.name + ' (' + record.symbol + ')'} address={record.contract_address}/>
                            </h5>
                            <p>{record.token_desc}</p>
                        </div>
                    </div>
                }
            },
            {
                title: intl.formatMessage({id: 'market_capitalization'}),
                align: 'center',
                className: 'ant_table d-none d-md-table-cell _text_nowrap',
                render: (text, record, index) => {
                    return <div>
                        {
                            record.price && record.total_supply_with_decimals?
                                <div><FormattedNumber value={record.total_supply_with_decimals * record.price} maximumFractionDigits={1}/> TRX</div>:
                                <span style={{color: '#666666'}}>-</span>
                        }
                    </div>
                }
            },
            {
                title: intl.formatMessage({id: 'pice_per_onetrx'}),
                dataIndex: 'pice_per_onetrx',
                key: 'pice_per_onetrx',
                align: 'center',
                className: 'ant_table',
                render: (text, record, index) => {
                    let lowerText = toLower(text)
                    return <div>
                        {
                            record.price?
                                <div><FormattedNumber value={record.price} maximumFractionDigits={1}/> TRX</div>:
                                <span style={{color: '#666666'}}>-</span>


                        }
                    </div>
                }
            },
            {
                title: intl.formatMessage({id: 'total_tokens'}),
                dataIndex: 'total_supply_with_decimals',
                key: 'total_supply',
                render: (text, record, index) => {
                    if (text === null)
                        text = 0;
                    return <div><FormattedNumber value={record.total_supply_with_decimals / (Math.pow(10,record.decimals))} maximumFractionDigits={1}/></div>
                },
                align: 'center',
                className: 'ant_table _text_nowrap'
            },
            {
                title: intl.formatMessage({id: 'contract_address'}),
                dataIndex: 'contract_address',
                key: 'contract_address',
                render: (text, record, index) => {
                    return <AddressLink address={record.contract_address} isContract={true} />
                },
                align: 'center',
                className: 'ant_table',
               // width: '350px',
            },

        ];
        return column;
    }

    render() {
        let {tokens, alert, loading, total} = this.state;
        let {match, intl} = this.props;
        let column = this.customizedColumn();
        let tableInfo = intl.formatMessage({id: 'part_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'part_pass'})
        return (
            <main className="container header-overlap token_black">
                {loading && <div className="loading-style"><TronLoader/></div>}
                {
                    <div className="row">
                        <div className="col-md-12 table_pos">
                            {total ?<div className="table_pos_info d-none d-md-block d-flex" style={{left: 'auto'}}>{tableInfo} &nbsp;&nbsp;
                                <Link to="/exchange/trc20">{t("Trade_on_TRXMarket")}></Link>
                            </div> : ''}
                            <a className="apply-trc20" href="https://goo.gl/forms/PiyLiDeaXv3uesSE3" target="_blank" style={{color:'#C23631'}}>
                                <button className="btn btn-danger">
                                    {tu('application_entry')}
                                </button>
                            </a>
                <SmartTable bordered={true} loading={loading} column={column} data={tokens} total={total}
                                        onPageChange={(page, pageSize) => {
                                            this.loadPage(page, pageSize)
                                        }}/>
                        </div>
                    </div>
                }
            </main>

        )
    }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        tokens: state.tokens.tokens,
        wallet: state.wallet,
        currentWallet: state.wallet.current,
    };
}

const mapDispatchToProps = {
    loadTokens,
    login,
    reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenList));
