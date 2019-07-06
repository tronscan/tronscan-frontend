/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {FormattedNumber} from "react-intl";
import {TronLoader} from "../../common/loaders";
import { Radio, Button } from 'antd'
import MonacoEditor from 'react-monaco-editor';
import {tu} from "../../../utils/i18n";
import CompilerConsole from "./CompilerConsole";
import CompilerJsoninfo from "./CompilerJsonInfo";
import VerifyContractCode from "./VerifyContractCode";
import CompilerModal from "./CompilerModal";
import { Base64 } from 'js-base64';
import xhr from "axios/index";
import SweetAlert from "react-bootstrap-sweetalert";
import _ from "lodash";

@connect(
    state => ({
        account: state.app.account,
        wallet: state.wallet.current,
    })
)
class ContractCompiler extends React.Component {
    constructor({match}) {
        super();

        this.state = {
            loading: false,
            compileLoading:false,
            deployLoading:false,
            code: `pragma solidity ^0.4.24;

interface tokenRecipient { 
    function receiveApproval(address _from, uint256 _value, bytes _extraData) external;
}

contract SafeMath {
    function safeMul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        _assert(a == 0 || c / a == b);
        return c;
    }

    function safeDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        _assert(b > 0);
        uint256 c = a / b;
        _assert(a == b * c + a % b);
        return c;
    }

    function safeSub(uint256 a, uint256 b) internal pure returns (uint256) {
        _assert(b <= a);
        return a - b;
    }

    function safeAdd(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        _assert(c >= a && c >= b);
        return c;
    }

    function _assert(bool assertion) internal pure {
        if (!assertion) {
            revert();
        }
    }
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
            filter: {
                direction:'compile1'
            },
            CompileStatus:[],
            modal: null,
            showModal:false,
        }
        this.onChange = this.onChange.bind(this)
    }

    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }

    onChange(newValue, e) {
        console.log('onChange', e);
        console.log("111",typeof newValue)
        let solidity = Base64.encode(newValue);
        this.setState({
            solidity,
            code:newValue
        })


    }

    componentDidMount() {
        let {match} = this.props;
       // this.loadContract(match.params.id);

    }

    componentWillUnmount() { }


    async loadContract(id) {
        //this.setState({loading: true, address: {address: id} });

    }

    onRadioChange = (val) => {
        this.setState({
            filter: {
                direction: val,
            }
        })
    };

    enterIconLoading = () => {
        this.setState({ deployLoading: true });
    };

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

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    compileModal = () => {
        this.setState({
            modal: (
                <CompilerModal
                    onHide={this.hideModal}
                    onConfirm={this.compile}
                />
            )
        });
    }

    compile = async () => {
        if(!this.isLoggedIn()) return;
        let { CompileStatus } = this.state;
        this.setState({
            compileLoading: true,
            CompileStatus:[],
        });
        let {data} = await xhr.post(`http://172.16.21.246:9016/v1/api/contract/compile`, {
            "compiler": "solidity-0.4.25_Odyssey_v3.2.3",
            "optimizer": "1",
            "solidity":this.state.solidity,
            "runs":200
        }).catch(function (e) {
            console.log(e)
            let errorData = [{
                type: "error",
                content: `Compiled error: ${e.toString()}`
            }]
            let error = errorData.concat(CompileStatus)
            // this.setState({
            //     CompileStatus:error,
            //     compileLoading: false
            // });
        });
        console.log('data',data)
        if(data.code == 200){
            this.setState({
                compileLoading: false
            });
            if(data.errmsg == null && data.data !=={}){
                let successData = [];
                let contractNameList = [];
                let mapArr = _.keyBy(data.data.byteCodeArr, "contractName");
                let compileInfo = _(data.data.abiArr).map(m => _.merge({}, m, mapArr[m.contractName]))
                    .concat(_.differenceBy(data.data.abiArr, data.data.byteCodeArr, "contractName"))
                    .value();
                 console.log('compileInfo',compileInfo)
                for (let i in compileInfo) {
                    let contract = compileInfo[i];
                    let contractName = contract.contractName
                    contractNameList.push(contractName)
                    console.log('contract',contract)
                    // successData.push({
                    //     type: "success",
                    //     content: `Compiled success: Contract '${contractName}' <CompilerJsoninfo data-component="CompilerJsoninfo" public:key={${i}_ABI} public:title="Show ABI" public:json='${JSON.stringify(
                    //         contract.abi
                    //     )}'/> <CompilerJsoninfo data-component="CompilerJsoninfo" public:key={${i}_Bytecode} public:title="Show Bytecode" public:json='${JSON.stringify(
                    //         contract.byteCode
                    //     )}'/>`
                    // })
                    successData.push({
                        type: "success",
                        class:"compile",
                        content: `Compiled success: Contract '${contractName}' <span id="${i}_ABI" >Show ABI</span> <span id="${i}_Bytecode">Show Bytecode</span>`,
                        contract:contract
                    })
                }
                this.setState({
                    contractNameList,
                    CompileStatus:successData,
                })
            }
        }else{
            if(data.errmsg){
                if(typeof data.errmsg === 'string'){
                    console.log('data.errmsg',data.errmsg)
                    let errorData = [{
                        type: "error",
                        content: `Compiled error: ${data.errmsg}`
                    }]
                    let error = errorData.concat(CompileStatus)
                    this.setState({
                        CompileStatus:error,
                        compileLoading: false
                    });
                }
            }
        }

    };


    render() {
        let {modal, loading, code, filter, compileLoading, deployLoading, CompileStatus } = this.state;
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <main className="container header-overlap ">
                {modal}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="compile-button-box">
                            <div className={filter.direction == 'compile'?'compile-button active':'compile-button'} onClick={() => this.onRadioChange('compile')}> {tu('合约部署')}</div>
                            <div className={filter.direction == 'verify'?'compile-button active ml-4':'compile-button ml-4'} onClick={() => this.onRadioChange('verify')}>{tu('合约验证')}</div>
                        </div>
                        <div className="compile-text mt-4">
                            {tu('Put your single file of smart contract here')}
                        </div>
                        <div className="card mt-4">
                            <div className="card-body">
                                <div className="d-flex contract-compiler">
                                    {
                                        filter.direction == 'compile' ?
                                            <div className="pt-3">
                                                <MonacoEditor
                                                    width="1110"
                                                    height="760"
                                                    language="sol"
                                                    theme="vs-dark"
                                                    value={code}
                                                    options={options}
                                                    onChange={this.onChange}
                                                    editorDidMount={this.editorDidMount}
                                                />
                                                <div className="contract-compiler-console">
                                                    <CompilerConsole  CompileStatus={CompileStatus}/>
                                                </div>
                                                <div className="contract-compiler-button">
                                                    <Button
                                                        type="primary"
                                                        loading={compileLoading}
                                                        onClick={this.compileModal}
                                                        className="compile-button compile"
                                                    >
                                                        {tu('编译')}
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        loading={deployLoading}
                                                        onClick={this.deployLoading}
                                                        className="compile-button active ml-4"
                                                    >
                                                        {tu('部署')}
                                                    </Button>
                                                </div>
                                            </div>
                                            :
                                            <div>
                                                <VerifyContractCode/>
                                            </div>
                                    }

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
    };
}

const mapDispatchToProps = {
};

export default injectIntl(ContractCompiler);
