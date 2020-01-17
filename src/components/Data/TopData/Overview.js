import React, { Fragment }  from 'react';
import { tu, t } from "../../../utils/i18n";
import { Link } from "react-router-dom";


class Overview extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data:this.props.topData,
    };
  }
  componentDidMount(){

  }
  render(){
    const { match, topData } = this.props;
    console.log('topData',topData)
    return(
      <Fragment>
        <div className="data-overview-list">
          <div className="d-flex justify-content-between">
            <div className="item">
              <div className="title px-3 d-flex justify-content-between">
                <div>{t('data_account')}</div>
                <div>
                  <Link to="/blockchain/data/account">{t('data_check')}</Link>
                </div>
              </div>
              <div className="content">
                <div className="content-item px-3 d-flex justify-content-between border-bottom">
                  <div>TRX转账总额</div>
                  <div>1,234,567</div>
                </div>
                <div className="content-item px-3 d-flex justify-content-between border-bottom">
                  <div>TRX转账总次数</div>
                  <div>1,234,567</div>
                </div>
                <div className="content-item px-3 d-flex justify-content-between border-bottom">
                  <div>冻结TRX总额</div>
                  <div>1,234,567</div>
                </div>
                <div className="content-item px-3 d-flex justify-content-between">
                  <div>投票总数</div>
                  <div>1,234,567</div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="title px-3 d-flex justify-content-between">
                <div>{t('data_token')}</div>
                <div>
                  <Link to="/blockchain/data/token">{t('data_check')}</Link>
                </div>
              </div>
              <div className="content">
                <div className="content-detail px-3">
                  <div className="detail-item d-flex justify-content-between">
                    <div>TRON通证总数</div>
                    <div>1,234,567</div>
                  </div>
                  <div className="detail-item d-flex justify-content-between">
                    <div>10通证总数</div>
                    <div>1,234,567</div>
                  </div>
                  <div className="detail-item d-flex justify-content-between">
                    <div>10通证总数</div>
                    <div>1,234,567</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Overview