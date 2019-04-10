import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps } from 'antd';

const Step = Steps.Step;


export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.state
    };
  }

  componentDidMount() {}

  setSelect(type) {
    this.setState({type}, ()=> {
      this.props.nextState(this.state)
    })
  }

  render() {
    let {nextStep, nextState} = this.props
    return (
        <main className="text-center">
          <h3 className="mb-3">{tu('select_type')}</h3>
          <h5 className="f-18 mb-3">推荐发行20通证 单击此处了解更多10，20通证的区别</h5>
          <p className="text-muted mb-3 font-weight-light">10通证不需要合约，1024个Trx <br/>
          20通证由智能合约发行，不需要Trx</p>

          <div className="d-flex w-50 justify-content-between mx-auto mb-5">
            <div onClick={() => {this.setSelect('trc10')}}>trc10</div>
            <div onClick={() => {this.setSelect('trc20')}}>trc20</div>
          </div>
          <button type="button" className="btn btn-danger btn-lg" style={{width: '252px'}}>{tu('trc20_confirm')}</button>
        
        </main>
    )
  }
}

export default injectIntl(TokenCreate);
