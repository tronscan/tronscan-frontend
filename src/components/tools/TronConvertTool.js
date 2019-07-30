import React, {Component} from 'react';
import {trim} from "lodash";
import {tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {BlockNumberLink} from "../common/Links";
import {FormattedNumber} from "react-intl";
import {TronLoader} from "../common/loaders";

class TronConvertTool extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loader: false
    };
  }

  componentDidMount() {
    let iframe = document.getElementById("convertTool");
    let _this = this
    iframe.onload = function () {
      _this.setState({
        loader: true
      });
    };

  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {

  }

  render() {

    return (
        <div className="container header-overlap">
          <div className="card">
            <div className="row" style={{justifyContent: 'center'}}>
              {
                <div className={this.state.loader ? "loader-hidden col-md-12" : "show col-md-12"}>
                  <TronLoader/>
                </div>
              }
              {
                <div className={this.state.loader ? "show col-md-12" : "hidden col-md-12"}
                     style={{width: '100%', height: '100%', minHeight: '750px', paddingTop: '15px', border: 0}}>
                  <iframe id="convertTool" title="TronConvertTool"
                          style={{width: '100%', height: '100%', minHeight: '750px', paddingTop: '15px', border: 0}}
                          src="https://tronscan.org/TronConvertTool/"></iframe>
                </div>
              }
            </div>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TronConvertTool)
