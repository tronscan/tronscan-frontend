import React, {Component} from 'react';
import {connect} from "react-redux";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
import {injectIntl} from "react-intl";
import {TokenLink} from "../common/Links";
import xhr from "axios/index";

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
    if (wallet) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        this.checkExistingToken();
      }
    }
  }

  checkExistingToken = () => {

    let {wallet} = this.props;
    if (wallet !== null) {

      xhr.get("http://18.216.57.65:20110/api/token?owner=" + wallet.address).then((result) => {

        if (result.data.data['Data'][0]) {
          this.setState({
            issuedAsset: result.data.data['Data'][0],
          });
        }
      });


      /*
      Client.getIssuedAsset(wallet.address).then(({token}) => {
         if (token) {
           this.setState({
             issuedAsset: token,
           });
         }
       });
      */
    }
  };

  download = () => {
    window.open("http://coin.top/tokenTemplate/TronscanTokenInformationSubmissionTemplate.xlsx");
  }

  render() {
    let {issuedAsset} = this.state;
    let {wallet} = this.props;

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
                      {tu("record_not_found")} &nbsp; {tu("try_later")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      );
    }
    return (
        <main className="container header-overlap news token_black mytoken">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="news_unit">
                    <h2>{tu('my_token')}</h2>
                    <p>{tu("my_token_desc_1")}<a href="#/rating" style={{color: 'red'}}> "{tu('tron_rating')}"</a></p>
                    <p>{tu("my_token_desc_2")}</p>
                    <hr/>
                  </div>

                  <div className="news_unit">
                    <table className="table myToken">
                      <tbody>
                      <tr>
                        <td style={{borderTop: '0px'}}>{tu("name_of_the_token")}:</td>
                        <td style={{borderTop: '0px'}}><TokenLink name={issuedAsset.name}/></td>
                      </tr>
                      <tr>
                        <td>{tu("brief_info")}:</td>
                        <td>{issuedAsset.description}</td>
                      </tr>
                      <tr>
                        <td className="text-nowrap">{tu("website_official")}:</td>
                        <td>{issuedAsset.url}</td>
                      </tr>
                      <tr>
                        <td className="text-nowrap borderBottom">{tu("white_paper")}:</td>
                        <td>{issuedAsset.white_paper && tu(issuedAsset.white_paper)}</td>
                      </tr>
                      <tr>
                        <td className="text-nowrap borderBottom">{tu("GitHub")}:</td>
                        <td>{issuedAsset.github && tu(issuedAsset.github)}</td>
                      </tr>
                      <tr>
                        <td className="text-nowrap borderBottom">{tu("country")}:</td>
                        <td>{issuedAsset.country && tu(issuedAsset.country)}</td>
                      </tr>
                      </tbody>
                    </table>
                    <hr/>
                    <h4>{tu('social_link')}</h4>
                    <div className="row socialMedia" style={{width: '60%'}}>
                      {
                        issuedAsset['social_media'] && issuedAsset['social_media'].map((media, index) => {
                          return <div className="col-md-5 mr-3 mb-2">
                            <img src={require('../../images/' + media.name + '.png')}/>
                            {!media.url ?
                                <span>{media.name}</span> :
                                <a href={media.url}>{media.name}</a>
                            }
                          </div>
                        })
                      }
                    </div>
                    <button className="btn btn-danger" onClick={this.download}><i className="fa fa-download mr-1"
                                                                                  aria-hidden="true"></i>{tu('download_excel')}
                    </button>
                  </div>
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
