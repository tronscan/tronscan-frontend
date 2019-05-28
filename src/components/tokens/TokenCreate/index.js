import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import moment from 'moment';
import { Steps } from 'antd';
import SelectTrc from './SelectTrc';
import InputInfo from './InputInfo/index';
import SubmitInfo from './SubmitInfo';
import ResultInfo from './resultInfo';
import { Prompt } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import SweetAlert from "react-bootstrap-sweetalert";
import { Modal, Button } from 'antd';
import NavigationPrompt from "react-router-navigation-prompt";
import xhr from "axios/index";
import {API_URL, ONE_TRX, CONTRACT_ADDRESS_USDT} from "../../../constants";
import {TronLoader} from "../../common/loaders";
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
      type: 'trc20',
      modal: null,
      isUpdate:false,
      leave_lock: true,
      paramData: {
        token_name: '',
        token_abbr: '',
        token_introduction: "",
        token_supply: '',
        precision: 0,
        logo_url: '',
        author: '',
        contract_address: '',
        contract_created_date: moment().startOf('day'),
        contract_code: '',
        website: '',
        email: '',
        white_paper: '',
        github_url:'',
        trx_amount: '',
        token_amount: '',
        participation_type: true,
        participation_start_date:  moment().add(1, 'days').startOf('day'),
        participation_end_date:  moment().add(2, 'days').startOf('day'),
        freeze_type: false,
        freeze_amount: '',
        freeze_date: '',
      },
      iconList: [
        {method: 'Twitter', active: true, link: ['']},
        {method: 'Facebook', active: true, link: ['']},
        {method: 'Telegram', active: true, link: ['']},
        {method: 'Weibo', active: true, link: ['']},
        {method: 'Reddit', active: false, link: []},
        {method: 'Medium', active: false, link: []},
        {method: 'Steemit', active: false, link: []},
        {method: 'Instagram', active: false, link: []},
        {method: 'Wechat', active: false, link: []},
        {method: 'Group', active: false, link: []},
        {method: 'Discord', active: false, link: []}
      ],
      res:'',
      errorInfo:'',

//           step:1,
//           type: 'trc20',
//           modal: null,
//           isUpdate:false,
//           leave_lock: true,
//           paramData: {
//           token_name: 'IseriCoin',
//               token_abbr: 'IRC',
//               token_introduction: "The most secure collaboration platform powered by Tron Foundation. All protected with end to end encryption.",
//               token_supply: '100000000000000000',
//               precision: 6,
//               logo_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
//               author: 'TA561MxvhxM4f81mU7bx9oipGP5zowTbhL',
//               contract_address: 'TC6o5RdXrvSQGtCedYja1KvnZTtSy681uS',
//               contract_created_date: moment().startOf('day'),
//               contract_code: `pragma solidity ^0.4.24;
//
// interface tokenRecipient {
//     function receiveApproval(address _from, uint256 _value, bytes _extraData) external;
// }
//
//
// contract Ownable  {
//     address  public  _owner;
//     bool  public  paused  =  false;
//     bool  public  burned  =  false;
//     bool  public  ceased  =  false;
//     event  OwnershipTransferred(address  indexed  previousOwner,  address  indexed  newOwner);
//
//     constructor ()  internal  {
//         _owner  =  msg.sender;
//     }
//
//     function  owner()  public  view  returns  (address)  {
//         return  _owner;
//     }
//
//     modifier  onlyOwner()  {
//         require(msg.sender  ==  _owner);
//         _;
//     }
//
//     function  transferOwnership(address  newOwner)  public  onlyOwner  {
//         require(newOwner  !=  address(0));
//         emit  OwnershipTransferred(_owner,  newOwner);
//         _owner  =  newOwner;
//     }
//
//     modifier  whenNotPaused()  {
//         require(!paused);
//         _;
//     }
//
//     modifier  whenPaused  {
//         require(paused);
//         _;
//     }
//
//     modifier  whenBurn  {
//         require(burned);
//         _;
//     }
//
//     modifier whenNotCease {
//         require(!ceased);
//         _;
//     }
//
//     function  pause()  external  onlyOwner  whenNotPaused  {
//         paused  =  true;
//     }
//
//     function  unPause()  public  onlyOwner  whenPaused  {
//         paused  =  false;
//     }
//
//     function openBurn() public onlyOwner{
//         burned = true;
//     }
//
//     function closeBurn() public onlyOwner{
//          burned = false;
//     }
//
//     function  cease()  external onlyOwner {
//         ceased  =  true;
//     }
//
//     function  unCease()  public onlyOwner {
//         ceased  =  false;
//     }
//
// }
//
// contract TRONAce is SafeMath,Ownable{
//     string public name = "TRONAce";
//     string public symbol = "ACE";
//     uint8 constant public decimals = 6;
//     mapping(address => uint256)  _balances;
//     mapping(address => mapping(address => uint256)) public _allowed;
//     mapping(address => uint256) public freezeBalance;
//     mapping(address => uint256) public lockBalance;
//     mapping(address => uint256) public unfreezeTime;
//
//     uint256 constant public precision = 1000000;
//     uint256 constant public yi = 100000000;
//     uint256 constant public daySec = 24 * 60 * 60;
//
//     uint256  public totalSupply = 1000 * yi * precision;
//     bool public stopped = false;
//
//     uint256 public Manydays = 2;
//
//
//     constructor () public{
//         _owner = msg.sender;
//         _balances[_owner] = totalSupply;
//         emit Transfer(0x0, _owner, totalSupply);
//     }
//
//     function balanceOf(address addr) public view returns (uint256) {
//         return _balances[addr];
//     }
//
//
//
//     function transfer(address _to, uint256 _value)  public returns (bool) {
//         require(_to != address(0));
//         require(_balances[msg.sender] >= _value && _value > 0);
//         require(_balances[_to] + _value >= _balances[_to]);
//
//         _balances[msg.sender] = safeSub(_balances[msg.sender], _value);
//         _balances[_to] = safeAdd(_balances[_to], _value);
//         emit Transfer(msg.sender, _to, _value);
//         return true;
//     }
//
//     function transferFrom(address _from, address _to, uint256 _value)  public returns (bool) {
//         require(_to != address(0));
//         require(_balances[_from] >= _value && _value > 0);
//         require(_balances[_to] + _value >= _balances[_to]);
//
//         require(_allowed[_from][msg.sender] >= _value);
//
//         _balances[_to] = safeAdd(_balances[_to], _value);
//         _balances[_from] = safeSub(_balances[_from], _value);
//         _allowed[_from][msg.sender] = safeSub(_allowed[_from][msg.sender], _value);
//         emit Transfer(_from, _to, _value);
//         return true;
//     }
//
//     function approve(address spender, uint256 value)  public returns (bool) {
//         require(spender != address(0));
//         _allowed[msg.sender][spender] = value;
//         emit Approval(msg.sender, spender, value);
//         return true;
//     }
//
//     function allowance(address _master, address _spender) public view returns (uint256) {
//         return _allowed[_master][_spender];
//     }
//
//
//     function burn(uint256 _value) whenBurn public returns (bool success) {
//         require(_balances[msg.sender] >= _value && totalSupply > _value);
//         _balances[msg.sender] = safeSub(_balances[msg.sender],_value);
//         totalSupply = safeSub(totalSupply, _value);
//         emit Burn(msg.sender, _value);
//         return true;
//     }
//
//     function approveAndCall(address _spender, uint256 _value, bytes _extraData) whenNotCease external returns (bool success) {
//         tokenRecipient spender = tokenRecipient(_spender);
//         if (approve(_spender, _value)) {
//             spender.receiveApproval(msg.sender, _value, _extraData);
//             return true;
//         }
//     }
//
//
//     function freeze(uint256 value) whenNotPaused public {
//         require(_balances[msg.sender] >= value  && value > 0);
//         _balances[msg.sender] = safeSub(_balances[msg.sender], value);
//         freezeBalance[msg.sender] = safeAdd(freezeBalance[msg.sender], value);
//         emit Freeze(msg.sender, value);
//     }
//
//     function unfreeze(uint256 value) whenNotPaused public {
//         require(value  > 0 && freezeBalance[msg.sender] >= value);
//         freezeBalance[msg.sender] = safeSub(freezeBalance[msg.sender], value);
//         lockBalance[msg.sender] = safeAdd(lockBalance[msg.sender], value);
//         unfreezeTime[msg.sender] = now;
//         emit Unfreeze(msg.sender, value);
//     }
//
//     function unlock(uint256 value) whenNotPaused public {
//         require(value > 0 && lockBalance[msg.sender] >= value);
//         require(now - unfreezeTime[msg.sender] >= daySec * Manydays);
//         lockBalance[msg.sender] = safeSub(lockBalance[msg.sender], value);
//         _balances[msg.sender] = safeAdd(_balances[msg.sender], value);
//         emit Unlock(msg.sender, value);
//     }
//
//     function setDaySec (uint256 value) public onlyOwner{
//         require(value >= 0);
//         Manydays = value;
//     }
//
//
//     function withdraw(address addr, uint256 amount) public onlyOwner {
//         addr.transfer(amount);
//         emit WithDraw(addr, amount);
//     }
//
//     function setName(string _name) onlyOwner public {
//         name = _name;
//     }
//
//     event Approval(address indexed _owner, address indexed _spender, uint256 _value);
//     event Transfer(address indexed _from, address indexed _to, uint256 value);
//     event Burn(address indexed _from, uint256 _value);
//
//     event WithDraw(address _addr, uint256 _amount);
//     event Freeze(address addr, uint256 value);
//     event Unfreeze(address addr, uint256 value);
//     event Unlock(address addr, uint256 value);
// }`,
//               website: 'www.baidu.com',
//               email: '431027103@qq.com',
//               white_paper: 'https://tether.to/wp-content/uploads/2016/06/TetherWhitePaper.pdf',
//
//               trx_amount: '',
//               token_amount: '',
//               participation_type: true,
//               participation_start_date:  moment().add(1, 'days').startOf('day'),
//               participation_end_date:  moment().add(2, 'days').startOf('day'),
//               freeze_type: false,
//               freeze_amount: '',
//               freeze_date: '',
//       },
//       iconList: [
//           {name: 'twitter', active: false, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'Facebook', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'telegram', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'weibo', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'reddit', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'Medium', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'steemit', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'Instagram', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'weixin', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'Group', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']},
//           {name: 'discord', active: true, links: ['https://twitter.com/TRONSCAN_ORG','https://twitter.com/TRONSCAN_ORG']}
//       ],
//           res:'',
//           errorInfo:'',

    };
  }

  componentDidMount() {
    let {match} = this.props;
    if(this.isLoggedIn()){
        if(match.path !=='/tokens/create' && match.params.id){
            if(!isNaN(match.params.id)){
                this.loadToken10(match.params.id)
            }else{
                this.loadToken20(match.params.id)
            }
        }else{

            this.setDefaultData()
        }
    }
  }

  loadToken10 = async (id) => {
      this.setState({ loading: true, isUpdate:true });
      let result = await xhr.get(API_URL+"/api/token?id=" + id + "&showAll=1");
      let token = result.data.data[0];
      console.log('token10',token);
      if(!token){
          this.setState({loading: false,token: null});
          this.props.history.push('/tokens/list')
          return;
      }
      let { frozen_supply } = await Client.getAccountByAddressNew(token.ownerAddress);

      this.setState({
          loading: false,
          step: 1,
          type: 'trc10',
          isUpdate:true,
          paramData: {
              token_name: token.name,
              token_abbr: token.abbr,
              token_introduction: token.description,
              token_supply: (token.totalSupply/ Math.pow(10,token.precision)).toString(),
              precision: token.precision,
              logo_url: token.imgUrl,
              author: token.ownerAddress,
              trx_amount: token.trxNum.toString(),
              token_amount:token.num.toString(),
              participation_type: token.endTime - token.startTime > 1000 ? true: false,
              participation_start_date: moment(token.startTime),
              participation_end_date:  moment(token.endTime),
              freeze_type: frozen_supply.length > 0 ? true : false,
              freeze_amount: frozen_supply.length > 0 ? frozen_supply[0].amount.toString(): '',
              freeze_date: frozen_supply.length > 0 ?frozen_supply[0].expires:'',
              website: token.url,
              email: token.email?token.email:'',
              white_paper: token.white_paper,
              github_url:token.github,

          },
          iconList: [
              {method: 'twitter', active: true, link: ['https://twitter.com/111','https://twitter.com/222']},
          ],

      });
  };

  loadToken20 = async (id) => {
        this.setState({loading: true,  isUpdate:true});
        let result = await xhr.get(API_URL+"/api/token_trc20?contract="+id);
        let token = result.data.trc20_tokens[0];
        console.log('token20',token);
        this.setState({
            loading: false,
            step: 1,
            type: 'trc20',
            isUpdate:true,
            paramData: {
                // token_name: token.name,
                // token_abbr: token.symbol,
                // token_introduction:token.token_desc,
                // token_supply: (token.total_supply_with_decimals/ Math.pow(10,token.decimals)).toString(),
                // precision: token.decimals,
                // logo_url: token.icon_url,
                // author: token.issue_address,
                // contract_address: token.contract_address,
                // contract_created_date: moment().startOf('day'),
                // website: token.home_page,
                // email: '123123123123123@qq.com',
                // white_paper: token.white_paper,
                // contract_code:'123123',
                token_name: 'IseriCoin',
                token_abbr: 'IRC',
                token_introduction: "encryption.",
                token_supply: '100000000000000000',
                precision: 6,
                logo_url: 'https://imgur.com/P4LkpL4.png',
                author: 'TA561MxvhxM4f81mU7bx9oipGP5zowTbhL',
                contract_address: 'TC6o5RdXrvSQGtCedYja1KvnZTtSy681uS',
                contract_created_date: moment().startOf('day'),
                contract_code: `pragma solidity ^0.4.24;

interface tokenRecipient { 
    function receiveApproval(address _from, uint256 _value, bytes _extraData) external;
}


contract Ownable  {
    address  public  _owner;
    bool  public  paused  =  false;
    bool  public  burned  =  false;
    bool  public  ceased  =  false;
    event  OwnershipTransferred(address  indexed  previousOwner,  address  indexed  newOwner);

    constructor ()  internal  {
        _owner  =  msg.sender;
    }

    function  owner()  public  view  returns  (address)  {
        return  _owner;
    }

    modifier  onlyOwner()  {
        require(msg.sender  ==  _owner);
        _;
    }

    function  transferOwnership(address  newOwner)  public  onlyOwner  {
        require(newOwner  !=  address(0));
        emit  OwnershipTransferred(_owner,  newOwner);
        _owner  =  newOwner;
    }

    modifier  whenNotPaused()  {
        require(!paused);
        _;
    }

    modifier  whenPaused  {
        require(paused);
        _;
    }

    modifier  whenBurn  {
        require(burned);
        _;
    }
    
    modifier whenNotCease {
        require(!ceased);
        _;
    }
    
    function  pause()  external  onlyOwner  whenNotPaused  {
        paused  =  true;
    }

    function  unPause()  public  onlyOwner  whenPaused  {
        paused  =  false;
    }
    
    function openBurn() public onlyOwner{
        burned = true;
    }
    
    function closeBurn() public onlyOwner{
         burned = false;
    }
    
    function  cease()  external onlyOwner {
        ceased  =  true;
    }

    function  unCease()  public onlyOwner {
        ceased  =  false;
    }

}

contract TRONAce is SafeMath,Ownable{
    string public name = "TRONAce"; 
    string public symbol = "ACE";       
    uint8 constant public decimals = 6;        
    mapping(address => uint256)  _balances;
    mapping(address => mapping(address => uint256)) public _allowed;
    mapping(address => uint256) public freezeBalance;
    mapping(address => uint256) public lockBalance;
    mapping(address => uint256) public unfreezeTime;
    
    uint256 constant public precision = 1000000;
    uint256 constant public yi = 100000000;
    uint256 constant public daySec = 24 * 60 * 60;
    
    uint256  public totalSupply = 1000 * yi * precision;
    bool public stopped = false;

    uint256 public Manydays = 2;
    

    constructor () public{
        _owner = msg.sender;
        _balances[_owner] = totalSupply;
        emit Transfer(0x0, _owner, totalSupply);
    }

    function balanceOf(address addr) public view returns (uint256) {
        return _balances[addr];
    }
    
    

    function transfer(address _to, uint256 _value)  public returns (bool) {
        require(_to != address(0));
        require(_balances[msg.sender] >= _value && _value > 0);
        require(_balances[_to] + _value >= _balances[_to]);
        
        _balances[msg.sender] = safeSub(_balances[msg.sender], _value);
        _balances[_to] = safeAdd(_balances[_to], _value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)  public returns (bool) {
        require(_to != address(0));
        require(_balances[_from] >= _value && _value > 0);
        require(_balances[_to] + _value >= _balances[_to]);
        
        require(_allowed[_from][msg.sender] >= _value);
        
        _balances[_to] = safeAdd(_balances[_to], _value);
        _balances[_from] = safeSub(_balances[_from], _value);
        _allowed[_from][msg.sender] = safeSub(_allowed[_from][msg.sender], _value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address spender, uint256 value)  public returns (bool) {
        require(spender != address(0));
        _allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(address _master, address _spender) public view returns (uint256) {
        return _allowed[_master][_spender];
    }

    
    function burn(uint256 _value) whenBurn public returns (bool success) {
        require(_balances[msg.sender] >= _value && totalSupply > _value);
        _balances[msg.sender] = safeSub(_balances[msg.sender],_value);
        totalSupply = safeSub(totalSupply, _value);                              
        emit Burn(msg.sender, _value);
        return true;
    }

    function approveAndCall(address _spender, uint256 _value, bytes _extraData) whenNotCease external returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, _extraData);
            return true;
        }
    }


    function freeze(uint256 value) whenNotPaused public {
        require(_balances[msg.sender] >= value  && value > 0);
        _balances[msg.sender] = safeSub(_balances[msg.sender], value);
        freezeBalance[msg.sender] = safeAdd(freezeBalance[msg.sender], value);
        emit Freeze(msg.sender, value);
    }

    function unfreeze(uint256 value) whenNotPaused public {
        require(value  > 0 && freezeBalance[msg.sender] >= value);
        freezeBalance[msg.sender] = safeSub(freezeBalance[msg.sender], value);
        lockBalance[msg.sender] = safeAdd(lockBalance[msg.sender], value);
        unfreezeTime[msg.sender] = now;
        emit Unfreeze(msg.sender, value);
    }

    function unlock(uint256 value) whenNotPaused public {
        require(value > 0 && lockBalance[msg.sender] >= value);
        require(now - unfreezeTime[msg.sender] >= daySec * Manydays);
        lockBalance[msg.sender] = safeSub(lockBalance[msg.sender], value);
        _balances[msg.sender] = safeAdd(_balances[msg.sender], value);
        emit Unlock(msg.sender, value);
    }
      
    function setDaySec (uint256 value) public onlyOwner{
        require(value >= 0);
        Manydays = value;
    }
    

    function withdraw(address addr, uint256 amount) public onlyOwner {
        addr.transfer(amount);
        emit WithDraw(addr, amount);
    }
    
    function setName(string _name) onlyOwner public {
        name = _name;
    }

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Transfer(address indexed _from, address indexed _to, uint256 value);
    event Burn(address indexed _from, uint256 _value);
    
    event WithDraw(address _addr, uint256 _amount);
    event Freeze(address addr, uint256 value);
    event Unfreeze(address addr, uint256 value);
    event Unlock(address addr, uint256 value);
}`,
                website: 'www.taobao.com',
                email: '2222222@qq.com',
                white_paper: 'https://666.pdf',
            },
            iconList: [
                {method: 'twitter', active: true, link: ['https://twitter.com/111','https://twitter.com/222']},
            ],

        });
    };

  componentDidUpdate(prevProps, prevState) {
    let {wallet} = this.props;
    if (wallet !== null) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        this.setDefaultData()
      }
    }
  }

  setDefaultData = () => {
    this.setState({
      paramData: {
        ...this.state.paramData,
      author: this.props.account.address
      }
    })
  }

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
          title={tu("not_signed_in")}
          confirmBtnText={intl.formatMessage({id: 'confirm'})}
          confirmBtnBsStyle="danger"
          onConfirm={() => this.setState({modal: null})}
          style={{marginLeft: '-240px', marginTop: '-195px'}}
        >
        </SweetAlert>
      })
    }
    return account.isLoggedIn;
  };

  render() {
    let {step, modal, paramData, leave_lock, isUpdate, loading} = this.state;
    //let info = !isUpdate ?['type', 'input', 'confirm', 'result']:['update_token', 'confirm', 'result'];
    let info = ['type', 'input', 'confirm', 'result'];
    return (
      <main  className="container pb-3 token-create header-overlap tokencreated token_black">
      <div className="steps mb-4 py-2">
        {
          info.map((item, index) => {
            let stepclass = ''
            if(index < step){ stepclass = 'is-success' }
            if(index == step){ stepclass = 'is-process' }
            if(index > step){ stepclass = 'is-wait' }
            return <div className={`${stepclass} steps-item`} key={index}>{index + 1}. {tu(item)}</div>
          })
        }
      </div>
          {
              loading ? <div className="card">
                  <TronLoader>
                      {tu("loading_token")}
                  </TronLoader>
              </div> : <div className="row">
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
                                  nextStep={(number) => {
                                      this.changeStep(number)
                                  }}
                                  nextState={(params) => {
                                      this.changeState(params)
                                  }}
                              />
                              }
                          </div>
                      </div>
                  </div>
              </div>
          }

          {modal}
          <NavigationPrompt when={leave_lock && step < 3}>
            {({ onConfirm, onCancel }) => (
              <SweetAlert
                info
                showCancel
                title={tu("leave_tip")}
                confirmBtnText={tu('confirm')}
                cancelBtnText={tu("cancel")}
                cancelBtnBsStyle="default"
                confirmBtnBsStyle="danger"
                onConfirm={onConfirm}
                onCancel={onCancel}
                style={{marginLeft: '-240px', marginTop: '-195px'}}
              >
              </SweetAlert>
            )}
          </NavigationPrompt>
        </main>
    )
  }
}

export default injectIntl(TokenCreate);
