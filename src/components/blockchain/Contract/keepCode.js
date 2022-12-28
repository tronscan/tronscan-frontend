import React from "react";
import {CopyText} from "../../common/Copy";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
// import { AddressLink} from "../../common/Links";
import {TronLoader} from "../../common/loaders";


export default class Code extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      compilerVersion: "",
      sourceCode: "",
      abi: "",
      creationCode: "",
      abiEncoded: "",
      address: "",
      byteCode: "",
      isSetting: 'Yes',
      librarys: null,
      loading: true
    };
  }

  componentDidMount() {
    let {filter} = this.props;
    this.loadContractCode(filter.address);
  }

  async loadContractCode(id) {
    this.setState({loading: true});
    let contractCode = await Client.getContractCode(id);

    this.setState({
      name: contractCode.data.name || "-",
      compilerVersion: contractCode.data.compiler,
      sourceCode: contractCode.data.source,
      abi: contractCode.data.abi,
      abiEncoded: contractCode.data.abiEncoded,
      address: contractCode.data.address,
      byteCode: contractCode.data.byteCode,
      isSetting: contractCode.data.isSetting? 'Yes': 'No',
      librarys: contractCode.data.librarys,
      loading: false
    }, () => {
      // this.ace.editor.setValue(this.state.sourceCode);
      // this.ace.editor.clearSelection();
    });

  }

  onChange = (newValue, e) => {

    //const editor = this.ace.editor;

  }

  render() {
    let {name, compilerVersion, sourceCode, abi, abiEncoded, address, byteCode, isSetting, librarys, loading} = this.state;

    return (
        <main className="container">
           {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
          <div className="row">
            <div className="col-md-12 contract-header">
              {/*<br/>*/}
              {/*<div className="pb-3 verified"><i className="fa fa-check-circle mr-1"></i>('contract_code_verified')</div> */}

              <div className="d-flex justify-content-between">
                <div className="contract-header__item">
                  <ul>
                    <li><p className="plus">{tu("contract_name")}:</p>{name}</li>
                    {/* <li><p className="plus">{tu('Optimization_Enabled')}: </p>{isSetting}</li> */}
                  </ul>
                </div>
                <div className="contract-header__item">
                  <ul>
                    {/* <li><p className="plus">{tu("Compiler_Text")}:</p>{compilerVersion}</li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>


          {/* <div className="row">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span><i className="fa fa-code"></i> {tu('contract_source_code')}</span>
                <CopyText text={sourceCode} className="ml-auto ml-1"/>
              </div>
              <ReactAce
                  mode="text"
                  theme="eclipse"
                  setReadOnly={true}
                  onChange={this.onChange}
                  style={{height: '400px'}}
                  ref={instance => {
                    this.ace = instance;
                  }}
              />

            </div>
          </div> */}

          <div className="row mt-3">
            <div className="col-md-12">
              <div className="d-flex mb-1">
                <span><i className="fa fa-cogs"></i> {tu('Contract_ABI')}</span>
                <CopyText text={abi} className="ml-auto ml-1"/>
              </div>
              <textarea className="w-100 form-control"
                        rows="7"
                        readOnly="readonly"
                        value={abi}
                        onChange={ev => this.setState({abi: ev.target.value})}/>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12">
              <div className="d-flex mb-1">
                <span><i className="fas fa-file-invoice"></i> {tu('Byte_code')}</span>
                <CopyText text={byteCode} className="ml-auto ml-1"/>
              </div>
              <textarea className="w-100 form-control"
                        rows="7"
                        readOnly="readonly"
                        value={byteCode}
                        onChange={ev => this.setState({byteCode: ev.target.value})}/>
            </div>
          </div>
          
          {/* { abiEncoded&&
          <div className="row mt-3">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span><i className="far fa-dot-circle"></i> {tu('Constructor_Arguments')}</span>
              </div>
              <textarea className="w-100 form-control"
                        rows="7"
                        readOnly="readonly"
                        value={abiEncoded}
                        onChange={ev => this.setState({abiEncoded: ev.target.value})}/>

            </div>
          </div>}

          { librarys&&(librarys.length !== 0)&&
          <div className="row mt-3">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span><i className="fas fa-map-marker-alt"></i> {tu('Library_Used')}</span>
              </div>
              <div className="code-wapper">
              { librarys.map( item => {
                  return <div className="code-wapper-item d-flex">
                    <p>{item.name}</p>
                    <AddressLink address={item.address} isContract={true}/>
                  </div>
                })
              }
              </div>

            </div>
          </div>} */}

        </main>

    )
  }
}
