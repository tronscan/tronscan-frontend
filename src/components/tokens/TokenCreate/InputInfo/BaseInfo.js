import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import {Client} from "../../../services/api";

const Step = Steps.Step;

@connect(
  state => ({
    wallet: state.wallet.current,
  })
)

export class BaseInfo extends Component {

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    return ()
  }
}

export default injectIntl(BaseInfo);
