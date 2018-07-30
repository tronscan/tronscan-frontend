import React, {Component} from 'react';
import {trim} from "lodash";
import {tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {CopyText} from "../common/Copy";
import {BlockNumberLink} from "../common/Links";
import {FormattedNumber} from "react-intl";


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
    return (
        <main className="contract container header-overlap">
          <div className="card">
            <div className="card-body">
              <div>
                <h5 className="card-title text-left">Verify and Publish your Solidity Source Code</h5>
                <p>
                  Step 1 : Enter your Contract Source Code below.
                </p>
                <p>
                  Step 2 : If the Bytecode generated matches the existing Creation Address Bytecode, the contract is
                  then
                  Verified.
                </p>
                <p>
                  Step 3 : Contract Source Code is published online and publicably verifiable by anyone.
                </p>
                <br/>
                <p>
                  NOTES
                </p>
                <p>
                  1. To verify Contracts that accept Constructor arguments, please enter the ABI-encoded Arguments in
                  the
                  last box below.
                </p>
                <p>
                  2. For debugging purposes if it compiles correctly at Browser Solidity, it should also compile
                  correctly
                  here.
                </p>
                <p>
                  3. Contracts that use "imports" will need to have the code concatenated into one file as we do not
                  support "imports" in separate files. You can try using the Blockcat solidity-flattener or
                  SolidityFlattery
                </p>
                <p>
                  4. We do not support contract verification for contracts created by another contract
                </p>
                <p>
                  5. There is a timeout of up to 45 seconds for each contract compiled. If your contract takes longer
                  than
                  this we will not be able to verify it.
                </p>
              </div>
              <hr/>
              <div className="row">
                <div className="col-md-3 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}><b>Contract Address </b>
                      <span>*</span>
                    </label>
                    <div>
                      <input type="text" className="form-control" placeholder="Contract Address"/>
                    </div>
                  </section>
                </div>
                <div className="col-md-3 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}><b>Contract Name </b>
                      <span>*</span>
                    </label>
                    <div>
                      <input type="text" className="form-control" placeholder="Contract Address"/>
                    </div>
                  </section>
                </div>
                <div className="col-md-3 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}><b>Compiler </b>
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
                <div className="col-md-3 mt-3 mt-md-0">
                  <section>
                    <label style={{whiteSpace: 'nowrap'}}><b>Optimization </b>
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

              <div className="row mt-3">
                <div className="col-md-12 ">
                  <div className="d-flex mb-1">
                    <span><b>Enter the Solidity Contract Code below</b> <i className="fa fa-cogs"></i></span>
                    <CopyText text={contractCode} className="ml-auto ml-1"/>
                  </div>
                  <textarea className="w-100 form-control"
                            rows="7"
                            value={contractCode}
                            onChange={ev => this.setState({contractCode: ev.target.value})}/>

                </div>
              </div>


              <hr/>
              <div className="row mt-3">
                <div className="col-md-12 ">
                  <p>
                    The following are optional Parameters
                  </p>
                  <span><b>Constructor Arguments ABI-encoded (For contracts that accept constructor parameters):</b></span>

                  <textarea className="w-100 form-control"
                            rows="7"
                            value={abi}
                            onChange={ev => this.setState({abi: ev.target.value})}/>

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

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyContractCode)
