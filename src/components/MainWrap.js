import {loadAccounts, setLanguage} from "../actions/app";
import {connect} from "react-redux";
import React from "react";
import Navigation from "./Navigation";
import Content from "./Content";
import {IntlProvider} from "react-intl";
import Lockr from "lockr";
import {ConnectedRouter} from 'react-router-redux'
import {reduxHistory} from "../store";
import SignModal from "./signing/SignModal";
import {BackTop} from 'antd';
import {find} from "lodash";
import {flatRoutes} from "../routes";
import {matchPath} from "react-router";

class MainWrap extends React.Component {
  constructor() {
    super();
    this.state = {
      languages: null
    };
    require.ensure([], (require) => {
      let {languages} = require('../translations');
      this.setState({
        languages: languages
      });
    }, "languages");

  }

  componentDidMount() {
    // Use language from local storage or detect from browser settings
    let language = Lockr.get("language", navigator.language.split(/[-_]/)[0]);
    this.props.setLanguage(language);

    // Redirect if old hash navigation is found
    let hash = window.location.hash;
    if (hash.length > 0) {
      let cmp = find(flatRoutes, route => route.path && matchPath(hash.substr(1), {
        path: route.path,
        strict: false,
      }));
      if (cmp !== null) {
        reduxHistory.push(hash.substr(1));
      }
    }
  }


  componentDidUpdate({theme}) {
    /* eslint-disable no-undef */
    document.body.classList.remove("theme-" + theme);
    document.body.classList.add("theme-" + this.props.theme);
  }

  render() {

    let {activeLanguage, router, flags} = this.props;
    let {languages} = this.state;

    return (

        languages &&
        <React.Fragment>
          <BackTop/>
          <IntlProvider
              locale={activeLanguage}
              messages={languages[activeLanguage]}>
            <ConnectedRouter history={reduxHistory}>
              <React.Fragment>
                {flags.mobileLogin && <SignModal/>}
                {
                  (router.location && router.location.pathname !== '/demo') &&
                  <Navigation/>
                }
                <Content router={router}/>
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
    account: state.app.account,
    router: state.router,
    theme: state.app.theme,
    flags: state.app.flags,
  };
}

const mapDispatchToProps = {
  loadAccounts,
  setLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(MainWrap);
