import {connect} from "react-redux";
import React from "react";
import {tu, t,option_t} from "../../utils/i18n";
import {alpha} from "../../utils/str";
import {Client} from "../../services/api";
import _ from "lodash";
import { Tag } from 'antd';
import {TokenLink, TokenTRC20Link, HrefLink, AddressLink} from "../common/Links";
import AppealModal from './AppealModal'
import xhr from "axios/index";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {API_URL} from "../../constants";
import { getTime} from "date-fns";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Tooltip} from "reactstrap";

class IssuedToken extends React.Component{
    constructor() {
        super();
        this.state = {
            disabled: false,
            modalStatus: false,
            appealInfo: {},
            appealInfo10: {},
            appealInfo20: [],
            token20List: [],
            copied: false,
            id: alpha(24)
        };
    }
    async showModal(type, index){
      const {appealInfo10, appealInfo20} = this.state
      let data = {}
      if(type == 'trx10') data = appealInfo10
      if(type == 'trx20'){
        data = appealInfo20[index]
      } 
      
      this.setState({appealInfo: data}, () => {
        this.setState({modalStatus: true})
      })
      
    }
    hiddenModal(){
      this.setState({modalStatus: false})
    }

    async getAppealRecent(address){
      const { intl } = this.props
      const {data: {data, retCode}} = await xhr.get(API_URL+'/external/trc_appeals/recent?address='+ address)
      if(retCode == 0){
        let appealInfo = {errorInfo: [], ...data.appeal}
        if(data.appeal){
          const appealArr = JSON.parse(data.appeal.reasons)
          appealArr.map(item => {
            console.log(item)
            let blackMap = intl.formatMessage({ id: `black_${item.id}` })
            if(item.id == 11){
              appealInfo.errorInfo.push(blackMap.replace('xxxxx', item.value.replace(/,$/, '')))
            }else{
              console.log(intl.formatMessage({ id: `black_${item.id}` }))
              appealInfo.errorInfo.push(blackMap)
            }
          })
        }
       return appealInfo
      }
    }
    async getAppealRecent10 (address) {
      const data = await this.getAppealRecent(address)
      console.log(data);
      this.setState({appealInfo10: data})
    }
    async getAppealRecent20 (list) {
      let arr = []
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        const data = await this.getAppealRecent(element.contract_address)
        arr.push(data)
      }
      this.setState({appealInfo20: arr})
    }



    // get 20 token transfer amount
    async getToken20Transfer(contract_address){
      const data = await Client.getTRC20tfs({limit: 0, start: 0, contract_address})
      return data.rangeTotal
    }

    // get 20 token holder
    async getToken20Holder(contract_address){
      const {data} = await xhr.get(API_URL +'/api/token_trc20/holders', {params: {limit: 0, start: 0, contract_address}})
      return data.rangeTotal
    }


    // get 20eoken
    async get20token() {
      const { address } = this.props.account
      const {data: {data, retCode}} = await xhr.get(API_URL+'/external/trc20tokens?issuer_addr='+ address)
      if(retCode == 0){
        let arr = []
        this.getAppealRecent20(data.tokens)

        for (let i = 0; i < data.tokens.length; i++) {
          let element = data.tokens[i];
          const holder = await this.getToken20Holder(element.contract_address)
          const transfer20 = await this.getToken20Transfer(element.contract_address)
          console.log(transfer20);
          
          element = {holder, transfer20, ...element}
          arr.push(element)
        }
        this.setState({token20List: arr})
      }
    }

    updateData(){
      const {loadAccount, issuedAsset} = this.props
      if(issuedAsset){
        loadAccount()
        this.getToken10Transfer()
      }else{
        this.get20token()
      }
    }

    setCopied = () => {
      this.setState({
        copied: true,
      });
  
      setTimeout(() => this.setState({ copied: false }), 1200);
    };

    componentDidUpdate(prevProps) {
      const {issuedAsset, account, activeLanguage} = this.props
      if(issuedAsset && (issuedAsset != prevProps.issuedAsset)){
        this.getAppealRecent10(issuedAsset.ownerAddress)
      }
      if(account != prevProps.account){
        this.get20token()
      }
      if(activeLanguage  != prevProps.activeLanguage){
        this.getAppealRecent10(account.address)
        this.get20token()
      }
      
    }

    componentDidMount() {
      this.get20token()
    }


    render() {
      const issuedAsset = this.props.issuedAsset;
      const {appealInfo,appealInfo10, token20List, appealInfo20, copied, id} = this.state;
      const { account, intl, currentWallet, unfreezeAssetsConfirmation } = this.props;

      let status10;
      let token10Time;
      if(issuedAsset){
        status10 = {
          isPassed: (issuedAsset.canShow == 0 || issuedAsset.canShow == 1 || issuedAsset.canShow == 2),
          isFailed: issuedAsset.canShow == 3,
          isAppealing: appealInfo && issuedAsset.canShow == 3 && appealInfo.status == 2,
        }
        token10Time = issuedAsset.dateCreated

        if(appealInfo10.update_time){
          token10Time = appealInfo10.update_time
        }
      }

        return (
          <div className="mt-4">
          {(Boolean(token20List.length) || issuedAsset) && <h4 style={{ marginBottom: '-0.5rem' }}>{tu('token_input_success_myaccount')}</h4>}
          <div>{issuedAsset && 
            <div className="tf-card mt-3">
              <div className="d-flex justify-content-between align-items-center pl-3">
                <h4>
                  <TokenLink id={issuedAsset.id} name={issuedAsset.name} address={issuedAsset.ownerAddress} namePlus={issuedAsset.name + ' (' + issuedAsset.abbr + ')'}/>
                  <span style={{color:"#999", fontSize: '12px'}}>[{issuedAsset.id}]</span>
               </h4>
               {
                status10.isPassed?
                   <a href={"#/tokens/update/"+ issuedAsset.id}>
                    <button type="button" className="btn btn-outline-danger btn-sm">{tu('updata_token_info')}</button>
                  </a>:
                  <button type="button" className="btn btn-outline-secondary btn-sm" disabled>{tu('updata_token_info')}</button>
               }
                </div>
              <hr className="my-3"/>
              <div className="d-flex justify-content-between tf-card__header position-relative">
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('trc20_token_info_Total_Supply')}</div>
                  <div className="tf-card__header-text"><FormattedNumber value={issuedAsset.totalSupply / 10 ** issuedAsset.precision}/></div>
                   {/** <div className="dor_line"></div>*/}
                </div>
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('holder_amount')}</div>
                  <div className="tf-card__header-text"><FormattedNumber value={issuedAsset.nrOfTokenHolders}/></div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/1.png")} alt=""/></div>*/}
                </div>
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('nr_of_Transfers')}</div>
                  <div className="tf-card__header-text"><FormattedNumber value={issuedAsset.rangeTotal}/></div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/2.png")} alt=""/></div>*/}
                </div>
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('day_trade')}</div>
                  <div className="tf-card__header-text">-</div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/3.png")} alt=""/></div>*/}
                </div>
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('last_price')}</div>
                  <div className="tf-card__header-text">-</div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/4.png")} alt=""/></div>*/}
                </div>
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('total_value')}</div>
                  <div className="tf-card__header-text">-</div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/5.png")} alt=""/></div>*/}
                </div>
              </div>
              
              <div className="question d-flex justify-content-end mb-2">
                  <div className="ml-1">
                    <span className="small">
                      {tu('address_total_balance_info_sources')}：
                    </span>
                    <span className="small">
                        <HrefLink
                            href={
                                intl.locale == "zh"
                                    ? "https://trx.market/zh/"
                                    : "https://trx.market/"
                            }
                        >TRXMarket</HrefLink>
                    </span>
                    <img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/>
                  </div>
                </div>
              

                <div className="iocInfo mb-4  w-100">
                    <div className="iocInfo-content ml-3">
                        <h4 className="mb-2" style={{fontWeight: '500'}}>{tu('ico_infomation')}</h4>
                        <div className="d-flex justify-content-between mb-1" style={{fontSize: '12px'}}>
                          <div>{tu("start_date")}
                            <span className="ml-1">{issuedAsset.endTime - issuedAsset.startTime > 1000 ?
                                <span><FormattedDate value={issuedAsset.startTime}/>{' '}<FormattedTime
                                    value={issuedAsset.startTime}  hour='numeric' minute="numeric" second='numeric' hour12={false}/></span> : "-"}
                            </span>
                          </div>
                          <div>{tu("end_date")}
                            <span className="ml-1"> {issuedAsset.endTime - issuedAsset.startTime > 1000 ?
                              <span><FormattedDate value={issuedAsset.endTime}/>{' '}<FormattedTime
                                  value={issuedAsset.endTime}  hour='numeric' minute="numeric" second='numeric' hour12={false}/></span> : "-"}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex mb-2">
                        {tu("progress")}:
                          <span className="d-flex flex-1 align-items-center">
                            {/** <div className="progress ml-1" style={{width: '95%'}}>
                              <div className="progress-bar bg-success"
                                  style={{width: issuedAsset.issuedPercentage + '%'}}/>
                            </div>*/}
                            <div className="progress ml-1 w-100">
                              <div className="progress-bar progress-bar-striped progress-bar-animated d-flex justify-content-center align-items-center" 
                              style={{width: issuedAsset.issuedPercentage + '%'}}>
                               <div className="text-white">{issuedAsset.issuedPercentage.toFixed(3) + '%'}</div>
                              </div>
                            </div>
                          </span>
                        </div>
                    </div>
                    <div className=" ml-3">{
                      currentWallet && currentWallet.frozen_supply.length > 0 &&
                      <div>
                        <a href="javascript:" className="float-right text-primary"
                            onClick={() => {
                              unfreezeAssetsConfirmation()
                            }}>
                          {tu("unfreeze_assets")}
                        </a>
                        {
                            currentWallet.frozen_supply.map((frozen, index) => (
                              <div key={index}>
                                {frozen.amount / Math.pow(10, issuedAsset.precision)}
                                {
                                  (frozen.expires > getTime(new Date())) ?
                                      <span>
                                      <span> {tu("can_be_unlocked")}&nbsp;</span>
                                      <FormattedRelative
                                          value={frozen.expires}/>
                                  </span> : <span> {tu("can_be_unlocked_now")}&nbsp;</span>
                                }
                              </div>
                          ))
                        }
                      </div>
                    }</div>
                </div>

              <table className="table tf-card-table">
                <tbody>
                  <tr className="line-1">
                    <td>
                      { status10.isPassed && <i className="fas fa-check-circle"></i> }
                      { !status10.isPassed && <div className="tip">1</div> }
                    </td>
                    <td></td>
                    <td>{tu('input_transcan')}</td>
                    <td>
                      { status10.isPassed && <Tag color="#28a745">{tu('type_pass')}</Tag> }
                      { status10.isFailed && <Tag color="#3d3d3d">{tu('type_black')}</Tag> }
                      { status10.isAppealing && <Tag color="#f5a623">{tu('type_appeal')}</Tag> }
                    </td>
                    <td className="text-light">
                      {status10.isPassed && tu('pass_time') }
                      {status10.isFailed && tu('black_time') }
                      {status10.isAppealing && tu('appeal_time') }
                      :<FormattedDate value={token10Time} className="ml-1"/>
                      {' '}
                      <FormattedTime value={token10Time}  hour='numeric' minute="numeric" second='numeric' hour12={false}/>
                    </td>
                    <td>
                      { status10.isFailed && <Tag color="#4a90e2" onClick={() => this.showModal('trx10')}>{tu('Appeal')}</Tag> }
                    </td>
                    <td><TokenLink 
                    name={tu('check_token_detail')} 
                    id={issuedAsset && issuedAsset.id}/></td>
                  </tr>
                  
                 {/* <tr className="line-2">
                    <td><div className="tip">2</div></td>
                    <td><Tag color="blue">{tu('application_entry')}</Tag></td>
                    <td>{tu('input_market')}</td>
                    <td></td>
                    <td className="text-light">{tu('pass_time')}:2019-03-04 20:00:00</td>
                    <td></td>
                    <td><a >{tu('check_market_detail')}</a></td>
                  </tr>
                  <tr className="line-3">
                    <td></td>
                    <td><Tag color="blue">{tu('application_entry')}</Tag></td>
                    <td>{tu('input_abcc')}</td>
                    <td></td>
                    <td className="text-light">{tu('pass_time')}:2019-03-04 20:00:00</td>
                    <td></td>
                    <td><a >{tu('check_abcc_detail')}</a></td>
                  </tr>
                  <tr className="line-4">
                    <td><div className="tip">3</div></td>
                    <td></td>
                    <td className="text-light">{tu('input_cmc')}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><a >{tu('check_cmc_detail')}</a></td>
                  </tr> */}
                </tbody>
              </table>
            </div>}

            {Boolean(token20List.length) && 
              token20List.map((token20Item, index) => {
                
                let status20 = {
                  isPassed:  token20Item.status == 0 || token20Item.status == 1 || token20Item.status == 2,
                  isFailed: token20Item.status == 3,
                  isAppealing: false
                }
                const appealItem = appealInfo20[index]
                if(appealItem){
                  status20.isFailed = token20Item.status == 3 && appealItem.status == 0
                  status20.isAppealing = token20Item.status == 3 && appealItem.status == 2
                }
              
                
                return <div className={`mt-3 tf-card token20`} key={token20Item.contract_address}>
                  <div className="d-flex justify-content-between align-items-center pl-3">
                    <h4 className="m-0 ">
                      <TokenTRC20Link name={token20Item.name} namePlus={token20Item.name + ' (' + token20Item.symbol + ')'} address={token20Item.contract_address}/>
                      <span style={{color:"#999", fontSize: '12px'}}>[{token20Item.contract_address}]
                        <CopyToClipboard text={token20Item.contract_address}  onCopy={this.setCopied}>
                          <span id={id} className="ml-1" style={{cursor: 'pointer'}}>
                            <i className="fa fa-paste"/>
                            <Tooltip placement="top" isOpen={copied} target={id}>
                              {tu("copied_to_clipboard")}
                            </Tooltip>
                          </span>
                        </CopyToClipboard>
                      </span>
                  </h4>{
                  status20.isPassed?
                    <a href={"#/tokens/update/"+ token20Item.contract_address}>
                      <button type="button" className="btn btn-outline-danger btn-sm">{tu('updata_token_info')}</button>
                    </a>:
                    <button type="button" className="btn btn-outline-secondary btn-sm" disabled>{tu('updata_token_info')}</button>
                  }
                    </div>
                  <hr className="my-3"/>
                  <div className="d-flex justify-content-between tf-card__header">
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('trc20_token_info_Total_Supply')}</div>
                      <div className="tf-card__header-text"><FormattedNumber value={token20Item.total_supply / 10 ** token20Item.decimals}/></div>
                    </div>
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('holder_amount')}</div>
                      <div className="tf-card__header-text">
                        <FormattedNumber value={token20Item.holder}/>
                      </div>
                    </div>
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('nr_of_Transfers')}</div>
                      <div className="tf-card__header-text"><FormattedNumber value={token20Item.transfer20}/></div>
                    </div>
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('day_trade')}</div>
                      <div className="tf-card__header-text">-</div>
                    </div>
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('last_price')}</div>
                      <div className="tf-card__header-text">-</div>
                    </div>
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('total_value')}</div>
                      <div className="tf-card__header-text">-</div>
                    </div>
                  </div>

                  <div className="question d-flex justify-content-end mb-2">
                    <div className="ml-1">
                      <span className="small">
                        {tu('address_total_balance_info_sources')}：
                      </span>
                      <span className="small">
                          <HrefLink
                              href={
                                  intl.locale == "zh"
                                      ? "https://trx.market/zh/"
                                      : "https://trx.market/"
                              }
                          >TRXMarket</HrefLink>
                      </span>
                      <img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/>
                    </div>
                  </div>

                  <table className="table tf-card-table">
                    <tbody>
                      <tr className="line-1">
                        <td>
                          { status20.isPassed && <i className="fas fa-check-circle"></i> }
                          { !status20.isPassed && <div className="tip">1</div> }
                        </td>
                        <td></td>
                        <td>{tu('input_transcan')}</td>
                        <td>
                          { status20.isPassed && <Tag color="#28a745">{tu('type_pass')}</Tag> }
                          { status20.isFailed && <Tag color="#3d3d3d">{tu('type_black')}</Tag> }
                          { status20.isAppealing && <Tag color="#f5a623">{tu('type_appeal')}</Tag> }
                        </td>
                        <td className="text-light">
                          {status20.isPassed && tu('pass_time') }
                          {status20.isFailed && tu('black_time') }
                          {status20.isAppealing && tu('appeal_time') }
                          : 
                          <FormattedDate value={token20Item.update_time} className="ml-1"/>
                          {' '}
                          <FormattedTime value={token20Item.update_time}  hour='numeric' minute="numeric" second='numeric' hour12={false}/>
                        </td>
                        <td>
                          { status20.isFailed && <Tag color="#4a90e2" onClick={() => this.showModal('trx20', index)}>{tu('Appeal')}</Tag> }
                        </td>
                        <td>
                          <TokenTRC20Link name={tu('check_token_detail')} address={token20Item.contract_address}/>
                        </td>
                      </tr>
                      {/**
                      <tr className="line-2">
                        <td><div className="tip">2</div></td>
                        <td><Tag color="blue">{tu('application_entry')}</Tag></td>
                        <td>{tu('input_market')}</td>
                        <td></td>
                        <td className="text-light">{tu('pass_time')}:2019-03-04 20:00:00</td>
                        <td></td>
                        <td><a >{tu('check_market_detail')}</a></td>
                      </tr>
                      <tr className="line-3">
                        <td></td>
                        <td><Tag color="blue">{tu('application_entry')}</Tag></td>
                        <td>{tu('input_abcc')}</td>
                        <td></td>
                        <td className="text-light">{tu('pass_time')}:2019-03-04 20:00:00</td>
                        <td></td>
                        <td><a >{tu('check_abcc_detail')}</a></td>
                      </tr>
                      <tr className="line-4">
                        <td><div className="tip">3</div></td>
                        <td></td>
                        <td className="text-light">{tu('input_cmc')}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><a >{tu('check_cmc_detail')}</a></td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
              })
            }
            <AppealModal 
              hiddenModal={() => this.hiddenModal()} 
              modalStatus={this.state.modalStatus} 
              appealInfo={appealInfo} 
              account={account} 
              toAppealing={() => this.updateData()}
            />
          </div>
          </div>)
    }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        wallet: state.wallet,
        currentWallet: state.wallet.current,
        activeLanguage: state.app.activeLanguage,
    };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(IssuedToken))

