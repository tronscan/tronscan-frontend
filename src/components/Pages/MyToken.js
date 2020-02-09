import React, {Component} from 'react';
import {connect} from "react-redux";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
import {injectIntl} from "react-intl";
import {TokenLink} from "../common/Links";
import xhr from "axios/index";
import {API_URL} from "../../constants";
import Address from '../addresses/Address';
import {Client} from "../../services/api";

class MyToken extends Component {
  constructor() {
    super();
    this.state = {
      issuedAsset: null,
      addressStatus: false
    };
  }

  componentDidMount() {
    let {wallet} = this.props;
    const address = this.props.location.search && this.props.location.search.split('?address=')[1]
    let walletAddress = '';
    if(address){
      walletAddress = address
    }else if(wallet){
      walletAddress = wallet.address
    }else{
      return false
    }

    this.setState({addressStatus: walletAddress})
    walletAddress && this.checkExistingToken(walletAddress);
   
  }

  componentDidUpdate(prevProps) {
    let {wallet} = this.props;
    if (wallet) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        this.checkExistingToken(wallet.address);
      }
    }
  }


  checkExistingToken = (walletAddress) => {
      Client.getIssuedAsset(walletAddress).then(({token}) => {
          this.setState({
              issuedAsset: token,
          });
      });
  };

  download = () => {
    window.open("http://coin.top/tokenTemplate/TronscanTokenInformationSubmissionTemplate.xlsx");
  }

  render() {
    let {issuedAsset,addressStatus} = this.state;
    let {wallet} = this.props;

    if (!wallet && !addressStatus) {
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
    if (!addressStatus) {
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
    if(issuedAsset){
    return (
        <main className="container header-overlap news token_black mytoken">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="news_unit">
                    <h2>{tu('update_token')}</h2>
                    <p>{tu("my_token_desc_1")}<a href="#/rating" style={{color: 'red'}}> "{tu('tron_rating')}"</a></p>
                    <p>{tu("my_token_desc_2")}</p>
                    <hr/>
                  </div>

                  <div className="news_unit">
                    <table className="table myToken">
                      <tbody>
                      <tr>
                        <td style={{borderTop: '0px'}}>{tu("name_of_the_token")}:</td>
                        <td style={{borderTop: '0px'}}>
                          <TokenLink id={issuedAsset.id} name={issuedAsset.name} address={issuedAsset.ownerAddress}/>
                          <span style={{color:"#999",fontSize:12}}>[{issuedAsset.id}]</span>
                        </td>
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
                          return <div className="col-md-5 mr-3 mb-2" key={index}>
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
                                                                                  ></i>{tu('download_excel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    )}
    return <div></div>
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
