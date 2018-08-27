import React, {Component} from 'react';
import {connect} from "react-redux";
import {HrefLink} from "../common/Links";
import {Client} from "../../services/api";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import {Alert} from "reactstrap";
import {TokenLink} from "../common/Links";

class MyToken extends Component {
  constructor() {
    super();
    this.state = {
      issuedAsset: null,
    };
  }

  componentDidMount() {
    this.checkExistingToken();
  }

  componentDidUpdate(prevProps) {
    let {wallet} = this.props;
    if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
      this.checkExistingToken();
    }
  }

  checkExistingToken = () => {

    let {wallet} = this.props;
    if (wallet !== null) {
      console.log(123);
      Client.getIssuedAsset(wallet.address).then(({token}) => {
        if (token) {
          this.setState({
            issuedAsset: token,
          });
        }
      });
    }
  };

  download = () => {
    window.open("https://codeload.github.com/douban/douban-client/legacy.zip/master");
  }

  render() {
    let {issuedAsset} = this.state;
    console.log(issuedAsset);
    let {wallet} = this.props;
    console.log(this.props.wallet);
    if (!wallet) {
      return (
          <main className="container pb-3 token-create header-overlap">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center p-3">
                      {tu("not_signed_in")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      );
    }
    if (!issuedAsset) {
      return (
          <main className="container pb-3 token-create header-overlap">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center p-3">
                      {tu("未找到通证发行记录")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      );
    }
    return (
        <main className="container header-overlap news">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h2>我发行的通证</h2>
                  <p>通证相关信息信息将展示在通证页，同时依据信息全面性和真实性获得<a href="#/rating" style={{color:'red'}}>“波场通证信誉评级”</a></p>
                  <p>如需修改信息，请使用公司邮箱或附其他证明文件，将修改信息发送至token@tron.network</p>
                  <hr/>

                  <table className="table myToken">
                    <tbody>
                    <tr>
                      <td style={{borderTop: '0px'}}>{tu("通证名称")}:</td>
                      <td style={{borderTop: '0px'}}><TokenLink name={issuedAsset.name}/></td>
                    </tr>
                    <tr>
                      <td>{tu("简介")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap">{tu("官网地址")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap borderBottom">{tu("白皮书链接")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap borderBottom">{tu("GITHUB链接")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap borderBottom">{tu("所在国家")}:</td>
                      <td></td>
                    </tr>
                    </tbody>
                  </table>
                  <hr/>
                  <h4>社交媒体链接</h4>
                  <div className="row socialMedia" style={{width: '60%'}}>
                    <div className="col-md-5">
                      <img src={require('../../images/reddit.png')}/>
                      <span>Reddit</span>
                    </div>
                    <div className="col-md-5 ml-2">
                      <img src={require('../../images/Twitter.png')}/>
                      <span>Twitter</span>
                    </div>
                    <div className="col-md-5 mt-2">
                      <img src={require('../../images/Facebook.png')}/>
                      <span>Facebook</span>
                    </div>
                    <div className="col-md-5 mt-2 ml-2">
                      <img src={require('../../images/telegram.png')}/>
                      <span>Telegram</span>
                    </div>
                    <div className="col-md-5 mt-2">
                      <img src={require('../../images/steem.png')}/>
                      <span>Steem</span>
                    </div>
                    <div className="col-md-5 mt-2 ml-2">
                      <img src={require('../../images/Medium.png')}/>
                      <span>Medium</span>
                    </div>
                    <div className="col-md-5 mt-2">
                      <img src={require('../../images/wechat.png')}/>
                      <span>Wechat</span>
                    </div>
                    <div className="col-md-5 mt-2 ml-2">
                      <img src={require('../../images/weibo.png')}/>
                      <span>Weibo</span>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-lg mt-5" onClick={this.download}>下载表格</button>
                </div>
              </div>
            </div>
          </div>
        </main>
    )
  }
}


function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    tokens: state.tokens.tokens,
    account: state.app.account,
    wallet: state.wallet.current,
  };
}

const mapDispatchToProps = {
  login,
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MyToken));
