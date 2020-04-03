/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import {reloadWallet} from "../../../actions/wallet";
import {TronLoader} from "../../common/loaders";
import {login} from "../../../actions/app";
import {withTronWeb} from "../../../utils/tronWeb";
import {ADDRESS_TAG_ICON} from "../../../constants";
import SweetAlert from "react-bootstrap-sweetalert";
import ApiClientAccount from "../../../services/accountApi";

function setTagIcon(tag){
  if(!tag) return
  let name = ''
  ADDRESS_TAG_ICON.map(v => {
    if(tag.indexOf(v) > -1){
      name = v
    }
  })
  return name && <img src={require(`../../../images/address/tag/${name}.svg`)}/>
}
@withTronWeb
class TagForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      modal: null,
      target_address:'',
      tag:'',
      description: '',
      addressTag:''
    };
  }

  componentDidMount() {
    let { targetAddress } = this.props;
    targetAddress && this.getTagsDetail(targetAddress)
  }

  async getTagsDetail(targetAddress){
    const {account} = this.props;
    let obj = {
      user_address: account.address,
      target_address:targetAddress,
      limit: 2,
      start: 0
    }
    let {retCode,retMsg,data} = await ApiClientAccount.getTagsList(obj)
    let detail = data.user_tags[0]
    if(retCode == 0){
      this.setState({
        target_address:targetAddress,
        tag:detail.tag,
        description: detail.description,
        addressTag:detail.addressTag
      })
    }
  }
  /**
   * Check if the form is valid
   * @returns {*|boolean}
   */
  isValid = () => {
    let {address} = this.state;   
    return isAddressValid(address);
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  setAccount = (address) => {
    this.setState({target_address: address});
    Client.getAddress(address).then(data => {
      this.setState({
        addressTag:data.addressTag?data.addressTag:''
      });
    })
  };

  setTag = (tag) => {
    let { intl }  = this.props;
    this.setState({
      tag
    });
    let tagTipsSpan = document.getElementById("tagTips");
    if (!tag.match( /^[\u4e00-\u9fa5|a-zA-Z]*$/)) {
      tagTipsSpan.innerHTML= intl.formatMessage({id: "account_tags_tag_valid"});
      return false;
    } else {
      tagTipsSpan.innerHTML='';
    }
    
  }

  setNote = (description) => {
    this.setState({
      description
    });
  };


  submit = async() => {
    const {target_address, tag,description } = this.state;
    const {account,targetAddress} = this.props;
    
    let obj = {
      user_address: account.address,
      target_address: target_address,
      tag: tag,
      description:description
    };

    let { retCode, retMsg } = targetAddress ? await ApiClientAccount.editTag(obj) : await ApiClientAccount.addTag(obj);
  
    if(retCode == 0){
      this.setState({
        modal: (
          <SweetAlert
            success
            title={targetAddress ? tu('account_tags_edit_success') : tu('account_tags_add_success')}
            onConfirm={this.hideModal}
          />
        )
      });
      this.props.onloadTable()
    }else{
      this.setState({
        modal: (
          <SweetAlert
            warning
            title={retMsg}
            onConfirm={this.hideModal}
          />
        )
      });
    } 
    
    setTimeout(()=>{
      this.setState({
        modal:null
      })
    },1000)
  }

  render() {

    let { intl } = this.props;
    let {isLoading, modal, description, target_address, tag , addressTag} = this.state;

    let isAccountValid = target_address.length !== 0 && isAddressValid(target_address);

    return (
        <form className="send-form">
          {modal}
          {isLoading && <TronLoader/>}
          <div className="form-group">
            <label><span style={{color:'#C23631'}}>*</span>{tu("data_account")}</label>
            <div className="input-group mb-3">
              <input type="text"
                     onChange={(ev) => this.setAccount(ev.target.value)}
                     className={"form-control " + (!isAccountValid ? "is-invalid" : "")}
                     value={target_address}
                     placeholder={intl.formatMessage({id: "account_tags_address_placehold"})}
                   
              />
              <div className="invalid-feedback">
                {tu("fill_a_valid_address")}
              </div>
            </div>
          </div>
          {
              addressTag?<div className="mb-3">
                <span style={{color:'#666666'}}>
                  {addressTag} {tu('account_address_name_tag')}
                </span>
              </div>:''
          }  
          <div className="form-group">
            <label><span style={{color:'#C23631'}}>*</span>{tu("account_tags_table_1")}</label>
            <div className="input-group mb-3">
              <input type="text"
                     onChange={(ev) => this.setTag(ev.target.value)}
                     className={"form-control " + (!isAccountValid ? "is-invalid" : "")}
                     value={tag}
                     placeholder={intl.formatMessage({id: "account_tags_tag_placehold"})}
                     maxLength="20"
              />
              <div className="invalid-feedback" id="tagTips">
                
              </div>
            </div>
          </div>
          {
              addressTag?<div className="mb-3">
                <span style={{color:'#666666'}}>
                {tu('account_tags_rec')}
                </span>
              </div>:''
          } 
          <div className="form-group">
            <label>{tu("note")}</label>
            <div className="input-group mb-3">
            <textarea
                onChange={(ev) => this.setNote(ev.target.value)}
                className={"form-control"}
                value={description}
                placeholder={intl.formatMessage({id: "account_tags_note_placehold"})}
            />
              <div className="invalid-feedback">
                {tu("fill_a_valid_address")}
              </div>
            </div>
          </div>
          <section className="text-center">
            <button className="btn btn-danger btn-lg" style={{width: '100%'}}  onClick={this.submit} >{tu("submit")}</button>
          </section>
        </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    wallet: state.app.wallet,
    tokenBalances: state.account.tokens,
    tokens20: state.account.tokens20,
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TagForm))
