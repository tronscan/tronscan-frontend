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
    this.props.nextState({type: type})
    this.setState({type})
  }

  render() {
    let {nextStep} = this.props
    let {type} = this.state
    return (
        <main className="text-center">
          <h2 className="mb-4 font-weight-bold">{tu('select_type')}</h2>
          <h5 className="f-18 mb-4 justify-content-center">
            {tu('select_trx_tip1')}
            <a className="col-red mx-1">{tu('select_trx_tip2')}</a>
            {tu('select_trx_tip3')}
          </h5>
          <p className="text-muted mb-4 font-weight-light">10通证不需要合约，1024个Trx <br/>
          20通证由智能合约发行，不需要Trx</p>

          <div className="d-flex justify-content-between mx-auto mb-5 select-trc">
            {
              [10, 20].map(item => {
                return  <div className={`select-trc-item ${type == `trc${item}`&& 'is-active'}`}  key={item}
                          onClick={() => {this.setSelect(`trc${item}`)}}>
                          <div className="text-center">
                            <h1 className="mb-0">{item}</h1>{tu('token')}
                          </div>
                        </div>
              })
            }
          </div>
          <button 
            type="button" 
            className="btn btn-danger btn-lg" 
            style={{width: '252px'}}
            onClick={() => nextStep(1)}
          >{tu('trc20_confirm')}</button>
        
        </main>
    )
  }
}

export default injectIntl(TokenCreate);
