/* eslint-disable no-restricted-globals */
import { connect } from "react-redux";
import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { tu } from "../../../utils/i18n";
import { Client } from "../../../services/api";
import { isAddressValid } from "@tronscan/client/src/utils/crypto";
import { reloadWallet } from "../../../actions/wallet";
import { TronLoader } from "../../common/loaders";
import { login } from "../../../actions/app";
import { withTronWeb } from "../../../utils/tronWeb";
import { ADDRESS_TAG_ICON } from "../../../constants";
import SweetAlert from "react-bootstrap-sweetalert";
import ApiClientAccount from "../../../services/accountApi";
import { QuestionMark } from "../../common/QuestionMark";
function setTagIcon(tag) {
  if (!tag) return;
  let name = "";
  ADDRESS_TAG_ICON.map((v) => {
    if (tag.indexOf(v) > -1) {
      name = v;
    }
  });
  return (
    name && <img src={require(`../../../images/address/tag/${name}.svg`)} />
  );
}
@withTronWeb
class TagForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      modal: null,
      target_address: "",
      tag: "",
      description: "",
      addressTag: "",
      recommendList: [],
    };
  }

  componentDidMount() {
    let { targetAddress,defaultAddress } = this.props;
    targetAddress && this.getTagsDetail(targetAddress);
    if(isAddressValid(defaultAddress)){
      this.setState({
        target_address:defaultAddress
      })
    }
  }

  async getTagsDetail(targetAddress) {
    const { account } = this.props;
    let obj = {
      user_address: account.address,
      target_address: targetAddress,
      limit: 2,
      start: 0,
    };
    let { retCode, retMsg, data } = await ApiClientAccount.getTagsList(obj);
    let detail = data.user_tags[0];
    if (retCode == 0) {
      this.setState({
        target_address: targetAddress,
        tag: detail.tag,
        description: detail.description,
        addressTag: detail.addressTag,
      });
    } else {
      this.setState({
        modal: <SweetAlert warning title={retMsg} onConfirm={this.hideModal} />,
      });
    }

    this.getRecommendTags(targetAddress);
  }

  getRecommendTags = (address) => {
    const { account, targetAddress } = this.props;

    ApiClientAccount.recTag({ target_address: address,user_address:account.address }).then((res) => {
      this.setState({
        recommendList: res.data.recommend_tags || [],
      });
    });
  };
  /**
   * Check if the form is valid
   * @returns {*|boolean}
   */
  isValid = () => {
    let { address } = this.state;
    return isAddressValid(address);
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  setAccount = (address) => {
    this.setState({ target_address: address });
    Client.getAddress(address).then((data) => {
      this.setState({
        addressTag: data.addressTag ? data.addressTag : "",
      });
    });

    this.getRecommendTags(address);
  };

  setTag = (tag) => {
    let { intl } = this.props;
    this.setState({
      tag,
    });
  };

  isValidTag = (tag) => {
    if (!tag.match(/^[\u4e00-\u9fa5|a-zA-Z|0-9]*$/)) {
      return true;
    }
  };

  setNote = (description) => {
    this.setState({
      description,
    });
  };

  submitTag = async () => {
    const { target_address, tag, description } = this.state;
    const { account, targetAddress } = this.props;
    if(!isAddressValid(target_address) || this.isValidTag(tag)){
      return ;
    }
    let obj = {
      user_address: account.address,
      target_address: target_address,
      tag: tag,
      description: description,
    };

    let { retCode, retMsg } = targetAddress
      ? await ApiClientAccount.editTag(obj)
      : await ApiClientAccount.addTag(obj);

    if (retCode == 0) {
      this.setState({
        modal: (
          <SweetAlert
            success
            title={
              targetAddress
                ? tu("account_tags_edit_success")
                : tu("account_tags_add_success")
            }
            onConfirm={this.hideModal}
          />
        ),
      });
      setTimeout(() => {
        this.props.onloadTable();
      }, 1000);
    } else {
      this.setState({
        modal: <SweetAlert warning title={retMsg && retMsg[0]} onConfirm={this.hideModal} />,
      });
    }
  };

  render() {
    let { intl, targetAddress } = this.props;
    
    let {
      isLoading,
      modal,
      description,
      target_address,
      tag,
      addressTag,
      recommendList,
    } = this.state;

   

    let isAccountValid =
      target_address.length !== 0 && isAddressValid(target_address);
    let isValidTag = tag.length != 0 && this.isValidTag(tag);
   
    return (
      <div className="send-form tag-form">
        {modal}
        {isLoading && <TronLoader />}
        <div className="form-group">
          <label>
            <span style={{ color: "#C23631" }}>*</span>
            {tu("data_account")}
          </label>
          <div className="input-group mb-3">
            <input
              type="text"
              onChange={(ev) => this.setAccount(ev.target.value)}
              className={
                "form-control " + (!isAccountValid ? "is-invalid" : "")
              }
              value={target_address}
              placeholder={intl.formatMessage({
                id: "fill_a_valid_address",
              })}
              disabled={targetAddress ? true : false}
            />
            <div className="invalid-feedback">{tu("fill_a_valid_address")}</div>
          </div>
        </div>
        {addressTag ? (
          <div className="mb-3">
            <span style={{ color: "#666666" }}>
              {addressTag} {tu("account_address_name_tag")}
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="form-group">
          <label>
            <span style={{ color: "#C23631" }}>*</span>
            {tu("account_tags_table_1")}{" "}
            <QuestionMark placement="top" text="account_tags_tip" />
          </label>
          <div className="input-group mb-3">
            <input
              type="text"
              onChange={(ev) => this.setTag(ev.target.value)}
              className={"form-control " + (isValidTag ? "is-invalid" : "")}
              value={tag}
              placeholder={intl.formatMessage({
                id: "account_tags_tag_placehold",
              })}
              maxLength="20"
            />
            <div className="invalid-feedback" id="tagTips">
              {tu("account_tags_tag_valid")}
            </div>
          </div>
        </div>
        {recommendList.length > 0 && (
          <div className="mb-3 d-flex">
            <span style={{ color: "#666666" }} className="mr-3">
              {tu("account_tags_rec")}
            </span>
            <span className="d-flex tag-flex-wrap">
              {recommendList.map((item, index) => (
                <span
                  className="rec-tags mr-3 d-flex"
                  key={index}
                  onClick={() => this.setTag(item.tag)}
                >
                  <span className="tag-name">{item.tag}</span>
                  <b className="ml-1">
                    {(item.number == 1 && intl.locale == 'en') ?  intl.formatMessage(
                      { id: "account_tags_number_rec_one" },
                      { number: item.number }
                    ) : intl.formatMessage(
                      { id: "account_tags_number_rec" },
                      { number: item.number }
                    )}
                  </b>
                </span>
              ))}
            </span>
          </div>
        )}
        <div className="form-group">
          <label>{tu("note")}</label>
          <div className="input-group mb-3">
            <textarea
              onChange={(ev) => this.setNote(ev.target.value)}
              className={"form-control"}
              value={description}
              placeholder={intl.formatMessage({
                id: "account_tags_note_placehold",
              })}
              maxLength="100"
            />
            <div className="invalid-feedback">{tu("fill_a_valid_address")}</div>
          </div>
        </div>
        <section className="text-center">
          <button
            className="btn btn-danger btn-lg"
            style={{ width: "100%" }}
            onClick={this.submitTag}
            disabled={!isAddressValid(target_address) || this.isValidTag(tag)}
          >
            {tu("submit")}
          </button>
        </section>
      </div>
    );
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TagForm));
