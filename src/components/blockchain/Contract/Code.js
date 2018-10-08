import React from "react";
import ReactAce from 'react-ace-editor';
import {CopyText} from "../../common/Copy";
import {tu, tv} from "../../../utils/i18n";
import {Client} from "../../../services/api";


export default class Code extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      compilerVersion: "",
      sourceCode: "",
      abi: "",
      creationCode: ""
    };
  }

  componentDidMount() {
    let {filter} = this.props;
    this.loadContractCode(filter.address);
  }

  async loadContractCode(id) {
    let contractCode = await Client.getContractCode(id);

    this.setState({
      name: contractCode.data.name,
      compilerVersion: contractCode.data.compilerVersion,
      sourceCode: contractCode.data.sourceCode,
      abi: contractCode.data.contractABI,
      creationCode: contractCode.data.contractCreationCode
    }, () => {
      this.ace.editor.setValue(this.state.sourceCode);
      this.ace.editor.clearSelection();
    });

    //this.ace.editor.setValue('123');
  }

  onChange = (newValue, e) => {

    //const editor = this.ace.editor;

  }

  render() {
    let {name, compilerVersion, sourceCode, abi, creationCode} = this.state;

    return (
        <main className="container">

          <div className="row">
            <div className="col-md-12 contract-header">
              <br/>
              <div className="pb-3 verified"><i className="fa fa-check-circle mr-1"></i> Contract Source Code Verified (Exact match)</div>

              <div className="d-flex justify-content-between">
                <div className="contract-header__item">
                  <ul>
                    <li><p className="plus">{tu("contract_name")}:</p>{name}</li>
                    <li><p className="plus">Optimization Enabled: </p>Yes</li>
                  </ul>
                </div>
                <div className="contract-header__item">
                  <ul>
                    <li><p className="plus">{tu("compiler_version")}:</p>{compilerVersion}</li>
                  </ul>
                </div>
              </div>
              {/* <table className="table table-hover mt-3">
                <tbody>

                <tr>
                  <th>{tu("contract_name")}:</th>
                  <td style={{width: '80%'}}>
                    {name}
                  </td>
                </tr>
                <tr>
                  <th>{tu("compiler_version")}:</th>
                  <td style={{width: '80%'}}>
                    {compilerVersion}
                  </td>
                </tr>

                </tbody>
              </table> */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span><i className="fa fa-code"></i> Contract Source Code</span>
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
          </div>

          <div className="row mt-3">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span><i className="fa fa-cogs"></i> Contract ABI</span>
                <CopyText text={abi} className="ml-auto ml-1"/>
              </div>
              <textarea className="w-100 form-control"
                        rows="7"
                        value={abi}
                        onChange={ev => this.setState({abi: ev.target.value})}/>

            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 ">
              <div className="d-flex mb-1">
                <span><i className="fa fa-braille"></i> Contract Creation Code</span>
                <CopyText text={creationCode} className="ml-auto ml-1"/>
              </div>
              <textarea className="w-100 form-control"
                        rows="7"
                        value={creationCode}
                        onChange={ev => this.setState({creationCode: ev.target.value})}/>

            </div>
          </div>

        </main>

    )
  }
}
