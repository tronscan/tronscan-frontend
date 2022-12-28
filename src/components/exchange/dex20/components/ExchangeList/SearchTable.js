import React from "react";
import {Table} from 'antd';
import {QuestionMark} from "../../../../common/QuestionMark";
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import {connect} from "react-redux";
import {getSelectData} from "../../../../../actions/exchange";
import {filter, map, upperFirst} from 'lodash'
import {injectIntl} from "react-intl";
import Lockr from "lockr";
import _ from "lodash";

class SearchTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            dataSource: props.dataSource,
            activeIndex:props.activeIndex,
            optional: []
        };
    }

    getColumns() {
        let {intl} = this.props;
        let {dataSource} = this.state;
        const columns = [{
            title: 'ID',
            key: 'ID',
            render: (text, record, index) => {
                return <span className='col-red'>{record.exchange_id}</span>
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: 'pairs'})),
            dataIndex: 'exchange_abbr_name',
            key: 'exchange_abbr_name',

        },
        {
            title: upperFirst(intl.formatMessage({id: "24H_VOL"})),
            dataIndex: 'svolume',
            key: 'svolume',
            render: (text, record, index) => {
                return (
                    <span>{record.svolume} TRX</span>
                )
            }
        }];

        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey={(record, index) => {
                    return index
                }}
                rowClassName={this.setActiveClass}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            this.onSetUrl(record)
                        },
                        // onClick: (e) => {
                        //     this.props.setCollection(e,record.exchange_id)
                        // },
                    }
                }}
            />
        )
    }


    setActiveClass = (record, index) => {
        return record.exchange_id === this.state.activeIndex ? "exchange-table-row-active" : "";
    }

    getData() {
        const parsed = queryString.parse(this.props.location.search).id;
        const {getSelectData} = this.props;
        let {dataSource} = this.state;
        const currentData = filter(dataSource, item => {
            return item.exchange_id == parsed
        })
        // 更新数据
        if (dataSource.length) {
            if (!parsed) {
                this.onSetUrl(dataSource[0])
            } else {
                getSelectData(currentData[0])
                this.setState({
                    activeIndex: currentData[0].exchange_id
                })
            }
        }


        // 获取选择状态
        map(dataSource, item => {
            if (item.exchange_id == parsed || !parsed) {
                item.isCurrent = true
            }
        })
    }

    onSetUrl(record) {
        const {getSelectData,setExchangeId} = this.props;
        this.setState({
            activeIndex: record.exchange_id //获取点击行的索引
        })

        this.props.history.push('/exchange/trc10?token=' + record.exchange_name + '&id=' + record.exchange_id)
        getSelectData(record, true)
        setExchangeId(record.exchange_id)
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: nextProps.dataSource,
        });
    }

    render() {
        return (
            <div>
                {this.getColumns()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    
    return {};
}

const mapDispatchToProps = {
    getSelectData,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(SearchTable)));

