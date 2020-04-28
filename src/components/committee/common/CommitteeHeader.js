import React, {Component} from 'react';
import {connect} from "react-redux";
import {t, tu} from "../../../utils/i18n";
import { Link } from "react-router-dom";


class CommitteeHeader extends Component {

  constructor() {
    super();
  }

  render(){
    const { type } = this.props
    return(
      <div className="committee-header">
        <div className="committee-intro d-flex align-items-center">
          <img src={require("../../../images/representatives/info.png")} alt=""/>
          <div>{tu('committee_header_intro')}</div>
        </div>
        <div className="committee-tab d-flex">
          <Link to="/sr/committee" className={`${type === 0 && 'active'}`}>{tu('TRON_network_parameters')}</Link>
          <Link to="/proposals" className={`${type === 1 && 'active'}`}>{tu('commission_proposed')}</Link>
        </div>
      </div>
    )
  }
}

export default CommitteeHeader