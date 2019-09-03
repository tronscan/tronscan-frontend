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
import { Popover, Button } from 'antd';
import { IS_SUNNET, IS_MAINNET } from './../../constants';
import MappingModal from './MappingModal';

class IssuedToken extends React.Component{
    constructor() {
        super();
        this.state = {
            disabled: false,
            modalStatus: false,
            token20List: [],
            appealInfo: '',
            copied: false,
            id: alpha(24),
            address: '',
            isShowMappingModal: false,
        };
    }
    async showModal(address){
      this.setState({address: address}, () => {
        this.setState({modalStatus: true})
      })
    }
    hiddenModal(){
      this.setState({modalStatus: false})
    }

    async getAppealRecent10(address){
      const {data: {data, retCode}} = await xhr.get(API_URL+'/external/trc_appeals/recent?address='+ address)
      if(retCode == 0){
        this.setState({appealInfo: data.appeal})
      }
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

        for (let i = 0; i < data.tokens.length; i++) {
          let element = data.tokens[i];
          const holder = await this.getToken20Holder(element.contract_address)
          const transfer20 = await this.getToken20Transfer(element.contract_address)
          
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
        // this.getToken10Transfer()
      }else{
        this.get20token()
      }
    }

    setCopied = (copied) => {
     this.setState({[copied]: true})
      setTimeout(() => this.setState({[copied]: false }), 1200);
    };

    componentDidUpdate(prevProps) {
      const {issuedAsset, account} = this.props

      if(account != prevProps.account){
        this.get20token()
      }
      if(issuedAsset && issuedAsset != prevProps.issuedAsset){
        this.getAppealRecent10(issuedAsset.ownerAddress)
      }
    }

    componentDidMount() {
      if(IS_MAINNET){
          this.get20token()
      }
    }

    /**
     * open MappingModal
     * @param address: symbol:currency
     */
    openMappingModal = (address, symbol) => {
      this.setState({
        isShowMappingModal: true,
        address,
        currency: symbol,
      });
    }

    /**
     * close MappingModal
     */
    closeMappingModal = () => {
      this.setState({ isShowMappingModal: false });
    }

    /**
     * Whether the mapping
     */
    isMapping = (mappedToSideChains) => {
      const { sidechains } = this.props;
      if (mappedToSideChains.length !== sidechains.length) {
        return false;
      } else {
        const sidechainList = sidechains.map(v => {
          return {
            chainid: v.chainid,
            mainchain_address: v.mainchain_gateway,
            sidechain_address: v.sidechain_gateway,
          };
        });
        const mappedToSideChainList = mappedToSideChains.map(v => {
          return {
            chainid: v.chainid,
            mainchain_address: v.mainchain_address,
            sidechain_address: v.sidechain_address,
          }
        })
        return _.isEqual(mappedToSideChainList, sidechainList);
      }
    }


    render() {
      const issuedAsset = this.props.issuedAsset;
      const { token20List, appealInfo, copied, id, isShowMappingModal, currency,
        address } = this.state;
      const { account, intl, currentWallet, unfreezeAssetsConfirmation, sidechains, walletType } = this.props;

      const isPrivateKey =  walletType.type === "ACCOUNT_PRIVATE_KEY";
      let status10;
      let token10Time;
      if(issuedAsset){
        status10 = {
          isPassed: issuedAsset.canShow == 1,
          isFailed: issuedAsset.canShow == 3,
          isAppealing: issuedAsset.canShow == 2,
        }
        
        token10Time = issuedAsset.dateCreated
        if(appealInfo){
          token10Time = appealInfo.update_time
        }
      }

      const content = (
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
        </div>
      )

      // mapping button item
      const mappingBtnItem = (id, currency) => (
        <Button type="primary" size="small" className="mapping-btn" onClick={() => this.openMappingModal(id, currency)}>
        {tu('main_account_mapping_btn')}</Button>
      )

      // Mapped button item
      const mappedBtnItem = (
        <Tag color="#87d068">{tu('main_account_mapping_success_btn')}</Tag>
      );

      // DAppChain Mapping Item
      const mppingItem = (id, currency, mappedToSideChains) => (
        <div className="row">
          <div className="col-md-12">
            <hr className="my-4"/>
            <p className="mapping-title">{tu('main_account_mapping_title')}</p>
          </div>
          <div className="col-md-12 d-flex justify-content-between">
            <div>
              <p>{tu('main_account_mapping_text')}</p>
              <p>{tu('main_account_mapping_text_1')}</p>
              <p>{tu('main_account_mapping_text_2')}</p>
            </div>
            <div>
              {
                this.isMapping(mappedToSideChains) ? mappedBtnItem : mappingBtnItem(id, currency)
              }
            </div>
          </div>
        </div>
      )

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
              <div className="d-flex justify-content-between tf-card__header mb-0 position-relative">
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('trc20_token_info_Total_Supply')}</div>
                  <div className="tf-card__header-text">
                    <FormattedNumber value={issuedAsset.totalSupply / 10 ** issuedAsset.precision} maximumSignificantDigits={18}/>
                  </div>
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
                  <div className="tf-card__header-title">{tu('day_trade')} 
                    <Popover  content={content} trigger="hover"><img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/></Popover>
                  </div>
                  <div className="tf-card__header-text">-</div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/3.png")} alt=""/></div>*/}
                </div>
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('last_price')}
                  <Popover  content={content} trigger="hover"><img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/></Popover></div>
                  <div className="tf-card__header-text">-</div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/4.png")} alt=""/></div>*/}
                </div>
                <div className="tf-card__header-item">
                  <div className="tf-card__header-title">{tu('total_value')}
                  <Popover  content={content} trigger="hover"><img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/></Popover></div>
                  <div className="tf-card__header-text">-</div>
                  {/** <div className="dor-img"><img src={require("../../images/issuedasset/5.png")} alt=""/></div>*/}
                </div>
              </div>

              <hr className="mt-2"/>
              

                <div className="iocInfo mb-4  w-100">
                    <div className="iocInfo-content ml-3">
                        <div className="d-flex justify-content-between mb-1" style={{fontSize: '12px'}}>
                          <h4 className="mb-2" style={{fontWeight: '500'}}>{tu('ico_infomation')}</h4>
                          <div className="d-flex">
                            <div className="mr-3">{tu("start_date")}
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
                        </div>
                        <div className="d-flex mb-2">
                          <span className="d-flex flex-1 align-items-center">
                            <div className="progress w-100">
                              <div className="progress-bar progress-bar-striped progress-bar-animated d-flex justify-content-center align-items-center" 
                              style={{width: issuedAsset.issuedPercentage + '%', backgroundColor: '#d93649'}}>
                               <div className="text-white">{issuedAsset.issuedPercentage > 5 ?issuedAsset.issuedPercentage.toFixed(3) + '%' :''}</div>
                              </div>
                            </div>
                          </span>
                        </div>
                    </div>
                    <div className=" ml-3">{
                      (currentWallet && currentWallet.frozen_supply.length > 0) &&
                      <div className="clearfix">
                        <a href="javascript:;" className="float-right"
                            onClick={() => {unfreezeAssetsConfirmation()}}>
                            <Tag className="ant-tag-default m-0">{tu("unfreeze_assets")}</Tag>
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
                                }</div>
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
                      { status10.isFailed && <Tag color="#4a90e2" onClick={() => this.showModal(issuedAsset.ownerAddress)}>{tu('Appeal')}</Tag> }
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
                  isPassed:  token20Item.status == 1,
                  isFailed: token20Item.status == 3,
                  isAppealing: token20Item.status == 2
                }
                
                return <div className={`mt-3 tf-card token20`} key={token20Item.contract_address}>
                  <div className="d-flex justify-content-between align-items-center pl-3">
                    <h4 className="m-0 ">
                      <TokenTRC20Link name={token20Item.name} namePlus={token20Item.name + ' (' + token20Item.symbol + ')'} address={token20Item.contract_address}/>
                      <span style={{color:"#999", fontSize: '12px'}}>[{token20Item.contract_address}]
                        <CopyToClipboard text={token20Item.contract_address}  onCopy={() => this.setCopied('id'+index)}>
                          <span id={'id'+index} className="ml-1" style={{cursor: 'pointer'}}>
                            <i className="fa fa-paste"/>
                            <Tooltip placement="top" isOpen={this.state['id'+index]} target={'id'+index}>
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
                      <div className="tf-card__header-text">
                        <FormattedNumber value={token20Item.total_supply / 10 ** token20Item.decimals} maximumSignificantDigits={18}/>
                      </div>
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
                      <div className="tf-card__header-title">{tu('day_trade')}
                      <Popover  content={content} trigger="hover"><img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/></Popover></div>
                      <div className="tf-card__header-text">-</div>
                    </div>
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('last_price')}
                      <Popover  content={content} trigger="hover"><img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/></Popover></div>
                      <div className="tf-card__header-text">-</div>
                    </div>
                    <div className="tf-card__header-item">
                      <div className="tf-card__header-title">{tu('total_value')}
                      <Popover  content={content} trigger="hover"><img width={15} height={15}  style={{marginLeft:5}} src={require("../../images/svg/market.png")} alt=""/></Popover></div>
                      <div className="tf-card__header-text">-</div>
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
                          { status20.isFailed && <Tag color="#4a90e2" onClick={() => this.showModal(token20Item.contract_address)}>{tu('Appeal')}</Tag> }
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
                  {isPrivateKey && !IS_SUNNET && mppingItem(token20Item.contract_address, token20Item.symbol, token20Item.sidechains)}
                </div>
              })
            }
            <AppealModal 
              hiddenModal={() => this.hiddenModal()} 
              modalStatus={this.state.modalStatus} 
              address={this.state.address} 
              account={account} 
              toAppealing={() => this.updateData()}
            />
          </div>
          {isShowMappingModal && <MappingModal onCancel={this.closeMappingModal} onConfirm={this.openMappingModal}
            address={address} currency={currency} />}
          </div>)
    }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        wallet: state.wallet,
        walletType: state.app.wallet,
        currentWallet: state.wallet.current,
        activeLanguage: state.app.activeLanguage,
        sidechains: state.app.sideChains,
    };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(IssuedToken))

