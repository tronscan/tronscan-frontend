import React, { Fragment, Component } from "react";
import { tu, tv } from "../../../utils/i18n";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";

class SourceCode extends Component {
  constructor({ match }) {
    super();

    this.state = {
      licenseUrl: [
        "https://github.com/github/choosealicense.com/blob/a40ef42140d137770161addf4fefc715709d8ccd/no-permission.md",
        "https://unlicense.org/",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/mit.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/gpl-2.0.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/gpl-3.0.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/lgpl-2.1.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/lgpl-3.0.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/bsd-2-clause.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/bsd-3-clause.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/mpl-2.0.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/osl-3.0.txt",
        "https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/apache-2.0.txt"
      ]
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {}

  render() {
    const licenseUrl = this.state.licenseUrl;
    return (
      <main className="container header-overlap token_black sorce-code-use">
        <div>
          <div className="mt-2">
            <p>{tu("contract_license_title_1")}</p>
            <p>{tu("contract_license_title_2")}</p>
          </div>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            1.{tu("contract_license_p1_title")}
            <a target="_blank" href={licenseUrl[0]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p1")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            2.{tu("contract_license_p2_title")}
            <a target="_blank" href={licenseUrl[1]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p2")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            3.{tu("contract_license_p3_title")}{" "}
            <a target="_blank" href={licenseUrl[2]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p3")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            4.{tu("contract_license_p4_title")}{" "}
            <a target="_blank" href={licenseUrl[3]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p4")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            5.{tu("contract_license_p5_title")}{" "}
            <a target="_blank" href={licenseUrl[4]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p5")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            6.{tu("contract_license_p6_title")}{" "}
            <a target="_blank" href={licenseUrl[5]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p6")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            7.{tu("contract_license_p7_title")}{" "}
            <a target="_blank" href={licenseUrl[6]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p7")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            8.{tu("contract_license_p8_title")}{" "}
            <a target="_blank" href={licenseUrl[7]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p8")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            9.{tu("contract_license_p9_title")}{" "}
            <a target="_blank" href={licenseUrl[8]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p9")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            10.{tu("contract_license_p10_title")}{" "}
            <a target="_blank" href={licenseUrl[9]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p10")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            11.{tu("contract_license_p11_title")}{" "}
            <a target="_blank" href={licenseUrl[10]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p11")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>
            12.{tu("contract_license_p12_title")}{" "}
            <a target="_blank" href={licenseUrl[11]}>
              -{tu("contract_license_makeInfo")}
            </a>
          </h5>
          <p>{tu("contract_license_p12")}</p>
        </div>
      </main>
    );
  }
}

export default injectIntl(SourceCode);
