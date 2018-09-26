import React, {Component} from 'react';
import {trim} from "lodash";
import {tu,t} from "../../utils/i18n";
import {connect} from "react-redux";
import {CopyText} from "../common/Copy";
import {NavLink} from "react-router-dom";
import {FormattedNumber, injectIntl} from "react-intl";
class VerifyContractCode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      abi:"",
      contractCode: "",
      selectedCompiler: "",
      Optimization: true,
      compilers: ['Please Select', 'v0.0.1', 'v0.0.2', 'v0.0.3', 'v0.0.4', 'v0.0.5'],
    };
  }

  componentDidMount() {

  }


  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {

  }

  compilerSelectChange = (e) => {
    this.setState({
      selectedCompiler: e.target.value
    });
  }

  optSelectChange = (e) => {
    this.setState({
      optimization: e.target.value
    });
  }

  render() {
    let {contractCode, selectedCompiler, compilers, abi} = this.state;
    let {intl} = this.props;
    return (
        <main className="contract container header-overlap">
          <div className="card" style={styles.card}>
            <div className="card-header list-style-body__header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a href="javascript:;" className="nav-link text-dark active">
                      <span>
                        <span>{tu("contract_source_code")}</span>
                      </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body contract-body">
              <div>
                <h5 className="card-title text-left contract-title">Verify and Publish your Solidity Source Code</h5>
                <p>
                    {tu("step")} 1 : {tu("step_1")}
                </p>
                <p>
                    {tu("step")} 2 : {tu("step_2")}
                </p>
                <p>
                    {tu("step")} 3 : {tu("step_3")}
                </p>
                <hr/>

                <p>
                    {tu("contract_notes")}
                </p>
                <p>
                  1. {tu("contract_notes_1")}
                </p>
                <p>
                  2. {tu("contract_notes_2_1")}
                  <a href="https://github.com/tronprotocol/tron-studio">
                      {tu("contract_notes_2_2")}
                  </a>
                  {t("contract_notes_2_3")}
                </p>
                <p>
                  3. {t("contract_notes_3")}
                </p>
                <p>
                  4. {t("contract_notes_4")}
                </p>
                <p>
                  5. {t("contract_notes_5")}
                </p>
              </div>
            </div>
            <hr style={styles.hr}/>
            <div className="card-body contract-body-input">
              <div className="row">
                <div className="col-md-4 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}>{tu("contract_address")}
                      <span>*</span>
                    </label>
                    <div>
                      <input type="text" className="form-control"
                             placeholder={intl.formatMessage({id: 'contract_address'})}/>
                    </div>
                  </section>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}>{tu("contract_name")}
                      <span>*</span>
                    </label>
                    <div>
                      <input type="text" className="form-control"
                             placeholder={intl.formatMessage({id: 'contract_name'})}/>
                    </div>
                  </section>
                </div>
                <div className="col-md-2 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}>{tu("compiler")}
                      <span>*</span>
                    </label>
                    <div>
                      <select className="custom-select" onChange={this.compilerSelectChange}>
                          {
                              compilers.map((compiler, index) => {
                                  return (
                                      <option key={index} value={compiler}>{compiler}</option>
                                  )
                              })
                          }
                      </select>
                    </div>
                  </section>
                </div>
                <div className="col-md-2 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}>{tu("optimization")}
                      <span>*</span>
                    </label>
                    <div>
                      <select className="custom-select" onChange={this.optSelectChange}>
                        <option key={1} value={true}>true</option>
                        <option key={0} value={false}>false</option>
                      </select>
                    </div>
                  </section>
                </div>
              </div>

              <div className="row mt-3 contract-code">
                <div className="col-md-12 ">
                  <div className="d-flex mb-1">
                    <span className="mb-3">{tu("enter_contract_code")}</span>
                    {/*<CopyText text={contractCode} className="ml-auto ml-1"/>*/}
                  </div>
                  <textarea className="w-100 form-control"
                            rows="11"
                            value={contractCode}
                            onChange={ev => this.setState({contractCode: ev.target.value})}/>
                </div>
              </div>
              <hr style={styles.hr_32}/>
              <div className="row mt-3 contract-ABI">
                <div className="col-md-12 ">
                  <p className="mb-3">
                      {tu("following_optional_parameters")}
                  </p>
                  <p style={styles.s_title}>{tu("constructor_arguments_ABIencoded")}</p>
                  <textarea className="w-100 form-control mt-3"
                            rows="1"
                            value={abi}
                            onChange={ev => this.setState({abi: ev.target.value})}/>

                </div>
                <div className="col-md-12">
                  <p className="mt-5">{tu("contract_library_address")}</p>
                  <div className="row">
                    <div className="col-md-5 contract-input">
                      <span>{tu("library_1_name")}:</span>
                      <input type="text" className="form-control"/>
                    </div>
                    <div className="col-md-7 contract-input">
                      <span>{tu("library_contract_address")}:</span>
                      <input type="text" className="form-control"/>
                    </div>
                  </div>
                </div>
              </div>
              <hr/>
              <div className="float-right">
                <button type="button" className="btn btn-primary btn-lg">Verify And Publish</button>
                <button type="button" className="btn btn-secondary btn-lg ml-3">Reset</button>
              </div>
            </div>

          </div>

        </main>
    );
  }
}

const styles = {
    card: {
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom:'none',
        borderRadius: 0
    },
    hr:{
        borderTop: '3px solid rgba(0, 0, 0, 0.1)',
        margin:0
    },
    hr_32:{
       marginTop:'2rem',
       marginBottom:'2rem'
    },
    s_title:{
      fontSize:16
    }

}
function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VerifyContractCode))