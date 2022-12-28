/* eslint-disable no-undef */
import React, { Fragment } from "react";
import { trim } from "lodash";
import { TronLoader } from "../../common/loaders";
import { ExternalLink } from "../../common/Links";
import { connect } from "react-redux";
import { Client } from "../../../services/api";
import { tu } from "../../../utils/i18n";
import ReactMarkdown from "react-markdown";
import xhr from "axios";
import Scrollspy from "react-scrollspy";
import { Sticky, StickyContainer } from "react-sticky";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import MediaQuery from "react-responsive";
import $ from "jquery/dist/jquery.js";

class Representative extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      body: null,
      address: null,
      files: null,
      sections: []
    };
  }

  componentDidMount() {
    let { match } = this.props;
    this.loadAddress(match.params.id);
  }

  componentDidUpdate(prevProps) {
    let { match } = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.loadAddress(match.params.id);
    }

    if (prevProps.activeLanguage !== this.props.activeLanguage) {
      this.reloadPages();
    }
  }

  getAddress() {
    return this.props.match.params.id;
  }

  async loadPage(url) {
    try {
      return await xhr.get(url);
    } catch (e) {
      return {};
    }
  }

  async loadPages(repository, language = "en") {
    let url = `https://raw.githubusercontent.com/${repository}/master`;

    if (language !== "en") {
      url += `/pages/${language}`;
    }

    let [
      { data: intro },
      { data: communityPlan },
      { data: team },
      { data: budgetExpenses },
      { data: serverConfiguration }
    ] = await Promise.all([
      this.loadPage(`${url}/INTRO.md`),
      this.loadPage(`${url}/COMMUNITY_PLAN.md`),
      this.loadPage(`${url}/TEAM.md`),
      this.loadPage(`${url}/BUDGET_EXPENSES.md`),
      this.loadPage(`${url}/SERVER_CONFIGURATION.md`)
    ]);

    return {
      intro,
      communityPlan,
      team,
      budgetExpenses,
      serverConfiguration
    };
  }

  async loadGithubData(repository) {
    let { activeLanguage } = this.props;

    let url = `https://raw.githubusercontent.com/${repository}/master`;

    let pages = await this.loadPages(repository);

    if (activeLanguage !== "en") {
      let translatedPages = await this.loadPages(repository, activeLanguage);

      for (let [pageId, pageContent] of Object.entries(translatedPages)) {
        if (trim(pageContent) !== "") {
          pages[pageId] = pageContent;
        }
      }
    }

    let {
      intro,
      communityPlan,
      team,
      budgetExpenses,
      serverConfiguration
    } = pages;

    this.setState({
      url,
      files: {
        logo: url + "/logo.png",
        banner: url + "/banner.png"
      },
      sections: [
        {
          name: tu("intro"),
          id: "intro",
          content: <ReactMarkdown source={intro} />
        },
        {
          name: tu("team"),
          id: "team",
          content: <ReactMarkdown source={team} />
        },
        {
          name: tu("community_plan"),
          id: "community-plan",
          content: <ReactMarkdown source={communityPlan} />
        },
        {
          name: tu("server_configuration"),
          id: "server-configuration",
          content: <ReactMarkdown source={serverConfiguration} />
        },
        {
          name: tu("budget_expenses"),
          id: "budget-expenses",
          content: <ReactMarkdown source={budgetExpenses} />
        }
      ]
    });
  }

  async reloadPages() {
    let sr = await Client.getSuperRepresentative(this.getAddress());
    await this.loadGithubData(sr.data.githubLink);
  }

  async loadAddress(id) {
    this.setState({
      loading: true,
      body: null,
      address: null,
      files: null
    });

    try {
      let address = await Client.getAddress(id);
      await this.reloadPages();

      this.setState({
        loading: false,
        address
      });
    } catch (e) {
      this.setState({
        body: (
          <main className="container header-overlap">
            <div className="card text-center">
              <div className="card-body">
                <Alert color="warning">
                  {tu("unable_load_representatives_page_message")}
                </Alert>
              </div>
              <p>
                <Link to="/sr/votes" className="btn btn-primary">
                  Go Back
                </Link>
              </p>
            </div>
          </main>
        )
      });
    }
  }

  scrollTo = ev => {
    ev.preventDefault();
    ev.stopPropagation();

    /* eslint-disable no-undef */

    $("html, body").animate(
      {
        scrollTop:
          $(
            $(ev.target)
              .closest("a")
              .attr("href")
          ).offset().top - 15
      },
      500
    );
  };

  renderSidebar = (props = {}) => {
    let { address, files, sections } = this.state;
    const defaultImg = require("../../../images/logo_default.png");

    return (
      <div style={{ ...props }}>
        <div className="card font-weight-bold mb-2">
          <img
            className="card-img-top"
            src={files.logo}
            onError={e => {
              e.target.onerror = null;
              e.target.src = defaultImg;
            }}
          />
          <Scrollspy
            items={sections.map(s => s.id)}
            className="list-group list-group-flush"
            currentClassName="is-current"
          >
            {sections.map(section => (
              <a
                key={section.id}
                className="list-group-item"
                href={"#" + section.id}
                onClick={this.scrollTo}
              >
                {section.name}
              </a>
            ))}
            <ExternalLink
              className=" list-group-item"
              url={address.representative.url}
            >
              Website
            </ExternalLink>
          </Scrollspy>
        </div>
        <Link className="btn btn-secondary btn-block mb-2" to="/sr/votes">
          <i className="fa fa-arrow-left mr-2" />
          {tu("go_to_votelist")}
        </Link>
      </div>
    );
  };

  render() {
    let { address, loading, files, sections, body } = this.state;

    if (body) {
      return body;
    }

    if (!address) {
      return (
        <main className="container header-overlap">
          <div className="card text-center">
            <TronLoader>{tu("loading_representatives")}</TronLoader>
          </div>
        </main>
      );
    }

    if (!address.representative.enabled) {
      return (
        <main className="container header-overlap">
          <div className="card text-center">
            <div className="card-body">
              <Alert color="warning">
                {tu("address_not_super_representative")}
              </Alert>
            </div>
            <p>
              <Link to="/sr/votes" className="btn btn-primary">
                Go Back
              </Link>
            </p>
          </div>
        </main>
      );
    }

    return (
      <main className="container header-overlap representative-landing-page">
        <StickyContainer className="row">
          <div className="col-md-3">
            <MediaQuery minWidth={768}>
              <Sticky>
                {({ style, isSticky }) =>
                  this.renderSidebar({
                    ...style,
                    ...(isSticky ? { top: 15 } : {})
                  })
                }
              </Sticky>
            </MediaQuery>
            <MediaQuery maxWidth={768}>{this.renderSidebar()}</MediaQuery>
          </div>
          <div className="col-md-9 representative-content">
            {loading ? (
              <div className="card">
                <TronLoader>
                  {tu("loading_representative")} {address.address}
                </TronLoader>
              </div>
            ) : (
              <Fragment>
                <div className="card">
                  {address.representative.enabled && (
                    <div className="card-header text-center bg-info font-weight-bold text-white">
                      {address.name || "Representative"}
                    </div>
                  )}
                  <div className="card-body text-center">
                    <img src={files.banner} style={styles.image} />
                  </div>
                </div>
                {sections.map(section => (
                  <div className="card mt-3">
                    <a id={section.id} />
                    <div className="card-header bg-info text-center text-white font-weight-bold">
                      {section.name}
                    </div>
                    <div className="card-body">{section.content}</div>
                  </div>
                ))}
              </Fragment>
            )}
          </div>
        </StickyContainer>
      </main>
    );
  }
}

const styles = {
  image: {
    maxWidth: "100%",
    maxHeight: 400
  }
};

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Representative);
