import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {Client} from "../../../../../services/api";
import {Link} from "react-router-dom";
import {tu} from "../../../../../utils/i18n";
import xhr from "axios/index";
import {map} from 'lodash'
import ExchangeTable from './Table';
import SearchTable from './SearchTable';
import Explain from './Explain';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import {filter} from 'lodash'
import _ from "lodash";
import {withRouter} from 'react-router-dom';
import {getSelectData,getExchanges20} from "../../../../../actions/exchange";
import {connect} from "react-redux";
import Lockr from "lockr";
import {QuestionMark} from "../../../../common/QuestionMark";
import {Input} from 'antd';

const Search = Input.Search;

class ExchangeList extends React.Component {

    constructor() {
        super();
        this.state = {
            dataSource: [],
            time: null,
            tokenAudited: true,
            exchangesList: [],
            optional:  Lockr.get('optional')?Lockr.get('optional'):[],
            optionalBok: false,
            search:'',
            searchExchangesList: [],
            showSearch:false,
            activeIndex:'',
            optionalDisable:false,
            searchAddId:false,
            tagLock: true
        };
    }

    componentDidMount() {
        const {getExchanges20} = this.props
        getExchanges20()
        this.getExchangesAllList();
        const getDataTime = setInterval(() => {
            this.getExchangesAllList();
        }, 10000)

        this.setState({time: getDataTime})
    }

    componentWillUnmount() {
        const {time} = this.state;
        clearInterval(time);
    }
    getExchangesAllList = async () =>{
        let { exchangesAllList }= await Client.getexchangesAllList();
        map(exchangesAllList, item => {
            if (item.up_down_percent.indexOf('-') != -1) {
                item.up_down_percent = '-' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
            } else {
                item.up_down_percent = '+' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
            }
        })
        this.setState({
            exchangesAllList: exchangesAllList,
        },() => {
            this.getExchanges();
        });
    }
    getExchanges = async () => {
        let { exchangesAllList} = this.state;
        let {exchange20List = []} = this.props
        let { data } = await Client.getExchangesList();
        let tab,exchangesList;
        if(Lockr.get("DEX")){
            tab = Lockr.get("DEX");
        }else{
            Lockr.set("DEX", 'Main');
            tab = 'Main'
        }
        map(data, item => {
            if (item.up_down_percent.indexOf('-') != -1) {
                item.up_down_percent = '-' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
            } else {
                item.up_down_percent = '+' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
            }
        });
        exchangesList = data.map(item => {
            item.optionalBok = false;
            return item
        });
        if (Lockr.get('optional')) {
            let optional = Lockr.get('optional');
            for (let i in exchangesAllList) {
                for (let j in optional) {
                    if (exchangesAllList[i].exchange_id == optional[j]) {
                        exchangesAllList[i].optionalBok = true;
                    }
                }
            }
        }
        if (Lockr.get('optional')) {
            let optional = Lockr.get('optional');
            for (let i in exchangesList) {
                for (let j in optional) {
                    if (exchangesList[i].exchange_id == optional[j]) {
                        exchangesList[i].optionalBok = true;
                    }
                }
            }
        }
        if (Lockr.get('dex20')) {
            let dex20list = Lockr.get('dex20');
            for (let i in exchange20List) {
                for (let j in dex20list) {
                    if (exchange20List[i].exchange_id == dex20list[j]) {
                        exchange20List[i].optionalBok = true;
                    }
                }
            }
        }

        let newlist = _.concat(exchange20List,exchangesAllList)
        let unreviewedTokenList = _(newlist)
            .filter(o => o['optionalBok'] == true)
            .value();


        this.setState({
            auditedTokenList: exchangesList,
            unreviewedTokenList: unreviewedTokenList,
            dataSource: tab == 'Main' ? exchangesList : unreviewedTokenList,
            tokenAudited: tab == 'Main' ? true : false,
            optionalDisable:true,
            exchangesAllList:exchangesAllList
        },() => {
        });
    }

    handleAuditedToken = () => {
        
        const {getSelectData, klineLock} = this.props;
        const {auditedTokenList,optionalDisable} = this.state;
        if(klineLock){
            if(!optionalDisable) return;
            Lockr.set("DEX", 'Main');
            this.setState({
                tokenAudited: true,
                dataSource: auditedTokenList,
                showSearch:false,
            });
            if(auditedTokenList.length > 0){
                this.props.history.push('/exchange?token=' + auditedTokenList[0].exchange_name + '&id=' + auditedTokenList[0].exchange_id)
                getSelectData(auditedTokenList[0], true)
                this.setState({
                    activeIndex:auditedTokenList[0].exchange_id,
                });
            }
        }
    }

    handleUnreviewedToken = () => {
        const {getSelectData} = this.props;
        const {unreviewedTokenList,optionalDisable} = this.state;
        if(!optionalDisable) return;
        Lockr.set("DEX", 'GEM');
        this.setState({
            tokenAudited: false,
            dataSource: unreviewedTokenList,
            showSearch:false,
        });
        if(unreviewedTokenList.length > 0){
            let favFirst = unreviewedTokenList[0];
            let url = ''
            favFirst.token_type == "dex20" ? url='/exchange20?token=' + unreviewedTokenList[0].exchange_name + '&id=' + unreviewedTokenList[0].exchange_id :url='/exchange?token=' + unreviewedTokenList[0].exchange_name + '&id=' + unreviewedTokenList[0].exchange_id
            this.props.history.push(url)
            getSelectData(unreviewedTokenList[0], true)
            this.setState({
                activeIndex:unreviewedTokenList[0].exchange_id,
            });
        }
    }

    setCollection = (ev,id, index,record) => {
        ev.stopPropagation();
        let {dataSource} = this.state;
        this.addOptional(id,record.token_type=='dex20');
        dataSource[index].optionalBok = !dataSource[index].optionalBok;
        this.setState({
            dataSource
        },()=>{
            this.getExchanges();
        });
    }

    addOptional = (id,type) =>{
        if(!type){
            let {optional} = this.state;

            if (optional.indexOf(id) == -1) {
                optional.push(id)
                this.setState({
                    optional
                });
            } else {
                optional = _.remove(optional, (n) => {
                    return n !== id;
                });
                this.setState({
                    optional
                });
            }
            Lockr.set('optional', optional);
        }else{
            let optional =  Lockr.get('dex20')|| []

            if (optional.indexOf(id) == -1) {
                optional.push(id)
            } else {
                optional = _.remove(optional, (n) => {
                    return n !== id;
                });
            }
            Lockr.set('dex20', optional)
        }
    }

    handleSearch = async(e) => {
        let {search} = this.state;
        let {data} = await Client.getExchangesList({
            name:search
        });
        this.setState({
            searchExchangesList:data,
            showSearch:true
        });
    }
    setExchangeId  = (id) =>{
        const {unreviewedTokenList,optional} = this.state;
        if (optional.indexOf(id) == -1) {
            optional.push(id)
            this.setState({
                optional
            });
        }
        Lockr.set("DEX", 'GEM');
        Lockr.set('optional', optional);
        this.setState({
            tokenAudited: false,
            dataSource: unreviewedTokenList,
            showSearch:false,
            search:'',
            activeIndex:id,
            searchAddId:true,
        },() => {
            this.getExchanges();
        });
    }
    setSearchAddId(){
        this.setState({
            searchAddId:false,
        })
    }
    
    gotoTrc20 = () => {
        const {klineLock} = this.props
        if(klineLock){
            Lockr.set('DEX', 'Main')
            this.props.history.push('exchange20')
        }
    }

    render() {
        const {dataSource, tokenAudited,search,showSearch,searchExchangesList,activeIndex,searchAddId} = this.state;
        let {intl} = this.props;
        let tab = Lockr.get("DEX") ? Lockr.get("DEX") : 'Main'
        return (
            <div className="exchange-list mr-2">

                {/* 市场 */}
                <div className="exchange-list-mark p-3">
                    {/* 标题 */}
                    <div className="market-title">
                        <h6>{tu("marks")}</h6>
                        <div className="beginners-guide">
                            <i className="fas fa-book-open"></i>
                            <a href={intl.locale == 'zh' ? "https://coin.top/production/js/20181211141620.pdf" : "https://coin.top/production/js/20181211141803.pdf"}
                               target="_blank">{tu('beginners_guide')}</a>
                        </div>
                    </div>

                    {/* filter 筛选 */}
                    <div className="exchange-list__filter d-flex justify-content-between align-items-center mb-3">
                        <ul className="d-flex ">
                            {/* <li className="mr-2">全部</li> */}
                            {/* <li><i className="fas fa-star mr-1" style={{ color: '#F5A623'}}></i>自选</li> */}
                        </ul>
                    </div>
                    <div className="dex-tab">
                        <div
                            className={"btn btn-sm"}
                            onClick={() => this.gotoTrc20()}>
                            TRC20
                        </div>
                        <div
                            className={"btn btn-sm" + (tokenAudited ? ' active' : '')}
                            onClick={this.handleAuditedToken}>
                           TRC10
                        </div>
                        <div
                            className={"btn btn-sm" + (tokenAudited ? '' : ' active')}
                            onClick={this.handleUnreviewedToken}>
                            <i>
                                <i className="fas fa-star"></i> {tu("Favorites")}
                            </i>
                        </div>
                    </div>
                    <div className="dex-search">
                        <Search
                            placeholder={intl.formatMessage({id: "dex_search_dec"})}
                            value={search}
                            onSearch={this.handleSearch}
                            onChange={ev => this.setState({search: ev.target.value})}
                        />
                    </div>
                    {
                        showSearch ?
                        <PerfectScrollbar>
                            <div className="exchange-list__table" style={styles.list}>
                                <SearchTable dataSource={searchExchangesList}
                                             props={this.props}
                                             tab={tab}
                                             setExchangeId={(id) => this.setExchangeId(id)}
                                             activeIndex={activeIndex}
                                />
                            </div>
                        </PerfectScrollbar>:
                        <PerfectScrollbar>
                            <div className="exchange-list__table" style={styles.list}>
                                <ExchangeTable dataSource={dataSource}
                                               props={this.props}
                                               tab={tab}
                                               setCollection ={(ev,id, index, record) => this.setCollection(ev,id,index,record)}
                                               activeIndex={activeIndex}
                                               searchAddId={searchAddId}
                                               setSearchAddId={() => this.setSearchAddId()}
                                />
                            </div>
                        </PerfectScrollbar>
                    }
                </div>

                {/* 说明 */}
                <Explain/>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activeLanguage:  state.app.activeLanguage,
        exchange20List: state.exchange.list_20,
        klineLock: state.exchange.klineLock,
    };
}

const mapDispatchToProps = {
    getSelectData,
    getExchanges20
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ExchangeList)));

const styles = {
    list: {
        height: 370,
    }
};
