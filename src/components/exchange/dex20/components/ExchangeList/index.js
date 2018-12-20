import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {Client} from "../../../../../services/api";
import {Client20} from "../../../api";
import {Link} from "react-router-dom";
import {tu} from "../../../../../utils/i18n";
import xhr from "axios/index";
import {map} from 'lodash'
import ExchangeTable from './Table';
import SearchTable from './SearchTable';
import {Explain} from './Explain';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import {filter, cloneDeep} from 'lodash'
import _ from "lodash";
import {withRouter} from 'react-router-dom';
import {getSelectData, getExchanges20} from "../../../../../actions/exchange";
import {connect} from "react-redux";
import Lockr from "lockr";
import {QuestionMark} from "../../../../common/QuestionMark";
import {Input, Radio} from 'antd';
import queryString from 'query-string';

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
            listGrount: {
                dex: [],
                dex20: [],
                favorites: []
            } 
        };
    }

    componentDidMount() {
        const {getExchanges20} = this.props;
        getExchanges20()
        const getDataTime = setInterval(() => {
            getExchanges20()
        }, 10000)

        this.setState({time: getDataTime})
    }

    componentWillUnmount() {
        const {time} = this.state;
        clearInterval(time);
    }

    componentDidUpdate(prevProps) {
        let { exchange20List } = this.props;
        let {tokenAudited} = this.state
        if ( exchange20List != prevProps.exchange20List) {
            this.setData(tokenAudited)
        }
    }
    setData(type){
       
        let { exchange20List } = this.props;
        if(type){
            this.setState({dataSource: exchange20List})
        }else{
            let new20List = exchange20List.filter(item => item.isChecked)

            this.setState({dataSource: new20List})
        }
    }
    handleSelectData = (type) => {
        this.setState({tokenAudited: type})
        this.setData(type)
        
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
                            className={"btn btn-sm" + (tokenAudited? ' active' : '')}
                            onClick={() => this.handleSelectData(true)}>
                            {tu("TRX_20")}
                        </div>
                        <div
                            className={"btn btn-sm" + (tokenAudited == 'trx_10' ? ' active' : '')}
                            onClick={() => this.handleSelectData('trx_10')}>
                            {tu("TRX")}
                        </div>
                        <div
                            className={"btn btn-sm" + (tokenAudited ? ' ' : ' active')}
                            onClick={() => this.handleSelectData(false)}>
                            <i>
                                <i className="fas fa-star"></i> {tu("Favorites")}
                            </i>
                        </div>
                    </div>
                    <div className="dex-search">
                        
                    </div>
                    {
                        <PerfectScrollbar>
                            <div className="exchange-list__table" style={styles.list}>
                                <ExchangeTable dataSource={dataSource} />
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
        exchange20List: state.exchange.list_20
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