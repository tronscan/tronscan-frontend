import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import moment from 'moment';
import { Steps } from 'antd';
import SelectTrc from './SelectTrc';
import InputInfo from './InputInfo';
import SubmitInfo from './SubmitInfo';
import ResultInfo from './resultInfo';
import { Prompt } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import SweetAlert from "react-bootstrap-sweetalert";
import { Modal, Button } from 'antd';
import {Client} from "../../../services/api";

const confirm = Modal.confirm;

const Step = Steps.Step;

@connect(
  state => ({
    account: state.app.account,
    wallet: state.wallet.current,
  })
)

// @reactMixin.decorate(Lifecycle)

export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      type: 'trc10',
      modal: null,
      paramData: {
        token_name: 'add',
        token_abbr: 'ADD',
        token_introduction: "Africa Trading Chain can be used to improve the financial support level of China-Africa cooperation by blockchain technology. The project origin is from the “One Belt and One Road” initiative and is based in Africa . It is also receiving strong supports from many African governments.",
        token_supply: '1000000000',
        precision: 6,
        logo_url: '',
        author: 'TA561MxvhxM4f81mU7bx9oipGP5zowTbhL',
        contract_address: '',
        contract_create_date: '',
        contract_code: "",
        website: 'www.baidu.com',
        email: '',
        white_paper: '',
        trx_amount: '0.1',
        token_amount: '1',
        participation_type: true,
        participation_start_date: moment(new Date().getTime()),
        participation_end_date: moment(new Date().getTime() + 24*60*60*1000),
        freeze_type: false,
        freeze_amount: '',
        freeze_date: '',
      },
      iconList: [
        {name: 'twitter', active: true, links: ['']},
        {name: 'Facebook', active: true, links: ['']},
        {name: 'telegram', active: true, links: ['']},
        {name: 'weibo', active: true, links: ['']},
        {name: 'reddit', active: false, links: ['']},
        {name: 'Medium', active: false, links: ['']},
        {name: 'steemit', active: false, links: ['']},
        {name: 'Instagram', active: false, links: ['']},
        {name: 'weixin', active: false, links: ['']},
        {name: 'Group', active: false, links: ['']},
        {name: 'discord', active: false, links: ['']}
      ],
    };
  }

  componentDidMount() {
    this.setState({
      paramData: {
        ...this.state.paramData,
       author: this.props.account.address
      }
    })
  }

  componentDidUpdate(prevProps) {}

  changeStep = (step) => {
    this.setState({step: step});
  }
  changeState = (params) => {
    this.setState(params);
  }

  isLoggedIn = () => {
    let {account, intl} = this.props;
    if(!account.isLoggedIn){
      this.setState({
        modal: <SweetAlert
          warning
          title={false}
          confirmBtnText={intl.formatMessage({id: 'confirm'})}
          confirmBtnBsStyle="warning"
          onConfirm={() => this.setState({modal: null})}
          style={{marginLeft: '-240px', marginTop: '-195px'}}
        >
          {tu("not_signed_in")}
        </SweetAlert>
      })
    }
    return account.isLoggedIn;
  };

  checkExistingToken = () => {
    let {wallet} = this.props;
    if (wallet !== null) {
      Client.getIssuedAsset(wallet.address).then(({token}) => {
        return token
      });
    }
  };

  getConfirmation (message,callback) {
    console.log(callback)
    return false
    // console.log(callback(false))
    // const allowTransition = window.confirm(message);
    // callback(allowTransition);
    // confirm({
    //   title: 'Do you want to delete these items?',
    //   content: 'When clicked the OK button, this dialog will be closed after 1 second',
    //   onOk() {
    //     callback(true)
    //   },
    //   onCancel() {
    //     callback(false)
    //   },
    // });
}
// <BrowserRouter getUserConfirmation={this.getConfirmation} >
// <Prompt message={location => {return 'aaa'}}/>
// </BrowserRouter>
 // <Prompt message="Are you sure you want to leave?" />
  render() {
    let {step, modal} = this.state;

    return (
      <main  className="container pb-3 token-create header-overlap tokencreated token_black">
        {modal}
        <BrowserRouter getUserConfirmation={this.getConfirmation} >
          <Prompt message="Are you sure you want to leave?" />
        </BrowserRouter>
        <div className="steps mb-4 py-2">
            {
              ['type', 'input', 'confirm', 'result'].map((item, index) => {
                let stepclass = ''
                if(index < step){ stepclass = 'is-success' }
                if(index == step){ stepclass = 'is-process' }
                if(index > step){ stepclass = 'is-wait' }
                return <div className={`${stepclass} steps-item`} key={index}>{index + 1}. {tu(item)}</div>
              })
            }
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  { step === 0 && 
                    <SelectTrc 
                      state={this.state} 
                      nextStep={(number) => {
                        this.changeStep(number)
                      }} 
                      nextState={(params) => {
                        this.changeState(params)
                      }}
                      isLoggedInFn={this.isLoggedIn}
                      checkExistingToken={this.checkExistingToken}
                    /> 
                  }
                  { step === 1 && 
                    <InputInfo 
                      state={this.state} 
                      nextStep={(number) => {
                        this.changeStep(number)
                      }} 
                      nextState={(params) => {
                        this.changeState(params)
                      }}
                    /> 
                  }
                  { step === 2 &&
                    <SubmitInfo
                        state={this.state}
                        nextStep={(number) => {
                            this.changeStep(number)
                        }}
                        nextState={(params) => {
                            this.changeState(params)
                        }}
                    />
                  }
                    { step === 3 &&
                    <ResultInfo
                        state={this.state}
                        // nextStep={(number) => {
                        //     this.changeStep(number)
                        // }}
                        // nextState={(params) => {
                        //     this.changeState(params)
                        // }}
                    />
                    }
                </div>
              </div>
            </div>
          </div>
        </main>
    )
  }
}

export default injectIntl(TokenCreate);
