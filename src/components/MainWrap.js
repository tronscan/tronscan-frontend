import { loadAccounts, setLanguage } from "../actions/app";
import { connect } from "react-redux";
import React from "react";
import Navigation from "./Navigation";
import Content from "./Content";
import { IntlProvider } from "react-intl";

import Lockr from "lockr";
import { ConnectedRouter } from "react-router-redux";
import { reduxHistory } from "../store";
import SignModal from "./signing/SignModal";
import { BackTop } from "antd";
import Footer from "./common/Footer";
class MainWrap extends React.Component {
  constructor() {
    super();
    this.state = {
      languages: null
    };
    import("../translations").then(({ languages }) => {
      this.setState({
        languages: languages
      });
    });
  }

  componentDidMount() {
    // Use language from local storage or detect from browser settings
    let language = Lockr.get("language", navigator.language.split(/[-_]/)[0]);
    this.props.setLanguage(language);
  }

  componentDidUpdate({ theme }) {
    /* eslint-disable no-undef */

    document.body.classList.remove("tron-light");
    document.body.classList.add("tron-light");
  }

  render() {
    let { activeLanguage, router, flags } = this.props;
    let { languages } = this.state;

    return (
      languages && (
        <React.Fragment>
          <BackTop />
          <IntlProvider
            locale={activeLanguage}
            messages={languages[activeLanguage]}
          >
            <ConnectedRouter history={reduxHistory}>
              <React.Fragment>
                {flags.mobileLogin && <SignModal />}
                {router.location && router.location.pathname !== "/demo" && (
                  <Navigation />
                )}
                <Content router={router}></Content>

                <Footer />
              </React.Fragment>
            </ConnectedRouter>
          </IntlProvider>
        </React.Fragment>
      )
    );
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    availableLanguages: state.app.availableLanguages,
    account: state.app.account,
    router: state.router,
    theme: state.app.theme,
    flags: state.app.flags
  };
}

const mapDispatchToProps = {
  loadAccounts,
  setLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(MainWrap);
