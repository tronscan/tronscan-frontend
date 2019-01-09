import React, {Fragment} from "react";
import {Link} from "react-router-dom"
import {injectIntl} from "react-intl";
import {Client} from '../../services/api'
import {tu} from "../../utils/i18n"
import {TronLoader} from "../common/loaders";
import { withRouter } from 'react-router'
import {connect} from "react-redux";

import Trc10 from './dex10/index';
import Trc20 from './dex20/index';


class Exchange extends React.Component {

  constructor() {
    super();
    this.state = {
      notice:[]
    };
  }

  async componentDidMount() {
      const {data} = await Client.getNotices({limit:3,sort:'-timestamp'});
      this.setState({notice:data})
  }

  componentWillUnmount() {
    const { widget10, widget20 } = this.props
    widget10 && widget10.remove()
    widget20 && widget20.remove()
  }

  

  render() {
    let {intl, match} = this.props;
    let lg = ''
    if(intl.locale === 'zh'){
        lg = 'CN';
    }else{
        lg = 'EN';
    }
    return (
        <div className="container header-overlap">
          <main className="exchange">
            <div className="notice">
              <img src={require('../../images/announcement-logo.png')} alt=""/>
              <div className="notice-wrap">
                  {
                      this.state.notice.map(v=>
                          <Link className="item" key={v.id} to={'/notice/'+v.id}>
                              <span title={v['title'+lg]} className="title">{v['title'+lg]}</span>
                              <span className="date">({v.createTime.substring(5,10)})</span>
                          </Link>
                      )
                  }
              </div>
                {
                  this.state.notice.length>0?<Link to={'/notice/'+this.state.notice[0].id}>{tu('learn_more')}></Link>:null
                }
            </div>

            { match.params.type === 'trc10' && <Trc10/> }
            { match.params.type === 'trc20' && <Trc20/> }
            
          </main>
        </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    widget10: state.exchange.trc10,
    widget20: state.exchange.trc20
  };
}

export default  connect(mapStateToProps, {})(injectIntl(withRouter(Exchange)))
