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
                  <h2>{tu('my_token')}</h2>
                  <p>{tu("my_token_desc_1")}<a href="#/rating" style={{color:'red'}}> "{tu('tron_rating')}"</a></p>
                  <p>{tu("my_token_desc_2")}</p>
                  <hr/>

                  <table className="table myToken">
                    <tbody>
                    <tr>
                      <td style={{borderTop: '0px'}}>{tu("name_of_the_token")}:</td>
                      <td style={{borderTop: '0px'}}><TokenLink name={issuedAsset.name}/></td>
                    </tr>
                    <tr>
                      <td>{tu("brief_info")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap">{tu("website_official")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap borderBottom">{tu("white_paper")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap borderBottom">{tu("GitHub")}:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className="text-nowrap borderBottom">{tu("country")}:</td>
                      <td></td>
                    </tr>
                    </tbody>
                  </table>
                  <hr/>
                  <h4>{tu('social_link')}</h4>
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
                  <button className="btn btn-danger btn-lg mt-5" onClick={this.download}>{tu('download_excel')}</button>
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
