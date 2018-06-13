import {loadAccounts, setLanguage} from "../actions/app";
import {connect} from "react-redux";
import React from "react";
import Navigation from "./Navigation";
import Content from "./Content";
import {IntlProvider} from "react-intl";
import {languages} from "../translations";
import Lockr from "lockr";
import {ConnectedRouter} from 'react-router-redux'
import {reduxHistory} from "../store";
import SignModal from "./signing/SignModal";
import {IS_DESKTOP} from "../constants";
import {LedgerAsync} from "./ledger/async";

class MainWrap extends React.Component {

  componentDidMount() {
    // Use language from local storage or detect from browser settings
    let language = Lockr.get("language", navigator.language.split(/[-_]/)[0]);
    this.props.setLanguage(language);
  }

  componentDidUpdate({theme}) {
    /* eslint-disable no-undef */
    document.body.classList.remove("theme-" + theme);
    document.body.classList.add("theme-" + this.props.theme);
  }

  render() {

    let {activeLanguage, router, flags} = this.props;


    return (
      <React.Fragment>
        <IntlProvider
          locale={activeLanguage}
          messages={languages[activeLanguage]}>
          <ConnectedRouter history={reduxHistory}>
            <React.Fragment>
              { flags.mobileLogin && <SignModal /> }
              { IS_DESKTOP && <LedgerAsync/> }
              <Navigation/>
              <Content router={router} />
            </React.Fragment>
          </ConnectedRouter>
        </IntlProvider>
      </React.Fragment>
    )
  }
}


function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    availableLanguages: state.app.availableLanguages,
    router: state.router,
    theme: state.app.theme,
    flags: state.app.flags,
  };
}

const mapDispatchToProps = {
  loadAccounts,
  setLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(MainWrap)
