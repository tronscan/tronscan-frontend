import React, { Component } from "react";
//import Lockr from "lockr";
import { injectIntl } from "react-intl";
import { withRouter, Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Badge } from "reactstrap";
import { Menu, Icon } from "antd";
import { tu, t } from "../utils/i18n";
//import { HrefLink } from "./common/Links";
import { filter, isString, isUndefined } from "lodash";
import { IS_MAINNET } from "../constants";

//import ReduxToastr from "react-redux-toastr";

const { SubMenu } = Menu;
class Menunavigation extends Component {
  constructor() {
    super();
    this.state = {
      openKeys: [],
      selectedKeyAry: []
    };
  }

  componentDidMount() {}

  // menu change time coll put away other menu
  onOpenChange = openKeys => {
    let rootSubmenuKeys = [];
    const { currentRoutes } = this.props;
    currentRoutes.forEach(res => {
      rootSubmenuKeys.push(res.path);
    });
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  render() {
    const { currentRoutes, activeLanguage, currentRouter } = this.props;
    const { selectedKeyAry } = this.state;
    return (
      <div>
        <Menu
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          style={{ width: 256 }}
          defaultSelectedKeys={selectedKeyAry}
          // defaultOpenKeys={['sub1']}
          mode="inline"
        >
          {filter(currentRoutes, r => r.showInMenu !== false).map(route =>
            !route.routes ? (
              <Menu.Item
                key={route.pathKey}
                className="dropdown-item text-uppercase"
              >
                <span
                  className={
                    currentRouter == route.path
                      ? "menu-single-tilte menu-active-tilte"
                      : "menu-single-tilte"
                  }
                  style={{
                    display: "inline-block",
                    width: "50%"
                  }}
                  onClick={() => {
                    this.props.changeDrawerFun();
                    this.props.history.push(route.path);
                  }}
                >
                  {tu(route.label)}
                </span>
              </Menu.Item>
            ) : (
              <SubMenu
                key={route.pathKey}
                title={
                  <span className="nav-network-hot">
                    {tu(route.label)}
                  
                  </span>
                }
              >
                <span>
                  {route.routes &&
                    route.label !== "nav_more" &&
                    route.label !== "nav_network" && 
                    route.label !== "newblock" && (
                      // className="dropdown-menu"
                      <div>
                        {route.routes &&
                          route.routes.map((subRoute, index) => {
                            if (subRoute === "-") {
                              return (
                                <div
                                  key={index}
                                  className="dropdown-divider"
                                ></div>
                              );
                            }

                            if (isString(subRoute)) {
                              return (
                                <h6 key={index} className="dropdown-header">
                                  {subRoute}
                                </h6>
                              );
                            }

                            if (subRoute.showInMenu === false) {
                              return null;
                            }

                            if (!isUndefined(subRoute.url)) {
                              return (
                                <Menu.ItemGroup
                                  key={subRoute.label}
                                  className="dropdown-item text-uppercase"
                                  href={subRoute.url}
                                  title={
                                    <span
                                      className="dapp-link-style"
                                      style={{
                                        display: "inline-block",
                                        width: "50%"
                                      }}
                                      onClick={() => {
                                        this.props.changeDrawerFun();
                                        window.open(subRoute.url, "_blank");
                                      }}
                                    >
                                      {subRoute.icon && (
                                        <i
                                          className={subRoute.icon + " mr-2"}
                                        />
                                      )}
                                      {tu(subRoute.label)}
                                      {subRoute.badge && (
                                        <Badge value={subRoute.badge} />
                                      )}
                                    </span>
                                  }
                                ></Menu.ItemGroup>
                              );
                            }
                            if (
                              !isUndefined(subRoute.enurl) ||
                              !isUndefined(subRoute.zhurl)
                            ) {
                              return (
                                <Menu.ItemGroup
                                  key={subRoute.label}
                                  className="dropdown-item text-uppercase"
                                  href={
                                    activeLanguage == "zh"
                                      ? subRoute.zhurl
                                      : subRoute.enurl
                                  }
                                  title={
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "50%"
                                      }}
                                      onClick={() => {
                                        this.props.changeDrawerFun();

                                        this.props.history.push(subRoute.enurl);
                                      }}
                                    >
                                      {subRoute.icon && (
                                        <i
                                          className={subRoute.icon + " mr-2"}
                                        />
                                      )}
                                      {tu(subRoute.label)}
                                      {subRoute.badge && (
                                        <Badge value={subRoute.badge} />
                                      )}
                                    </span>
                                  }
                                ></Menu.ItemGroup>
                              );
                            }

                            return (
                              <Menu.ItemGroup
                                key={subRoute.label}
                                className="dropdown-item text-uppercase"
                                to={subRoute.path}
                                title={
                                  <span
                                    className={
                                      currentRouter == subRoute.path
                                        ? "menu-single-tilte menu-active-tilte"
                                        : "menu-single-tilte"
                                    }
                                    style={{
                                      display: "inline-block",
                                      width: "50%"
                                    }}
                                    onClick={() => {
                                      this.props.changeDrawerFun();
                                      this.props.history.push(subRoute.path);
                                    }}
                                  >
                                    {subRoute.icon && (
                                      <i
                                        className={`${subRoute.icon} mr-2 fa_width`}
                                      />
                                    )}
                                    {tu(subRoute.label)}
                                    {subRoute.badge && (
                                      <Badge value={subRoute.badge} />
                                    )}
                                  </span>
                                }
                              ></Menu.ItemGroup>
                            );
                          })}
                      </div>
                    )}
                  {route.routes &&
                    (route.label == "nav_network" ||
                      route.label == "nav_more" ||  route.label == "newblock") && (
                      <div>
                        {route.routes &&
                          route.routes.map((subRoute, index) => {
                            return (
                              <div className="more-menu-mobile-wrapper" key={index}>
                                <div className="more-menu-line"></div>
                                {subRoute.map((Route, j) => {
                                  if (isString(Route)) {
                                    return (
                                      <h6
                                        key={j}
                                        className="dropdown-header text-uppercase"
                                      >
                                        {" "}
                                        {tu(Route)}
                                      </h6>
                                    );
                                  }

                                  if (Route.showInMenu === false) {
                                    return null;
                                  }
                                  //wjl
                                  if (
                                    !isUndefined(Route.url) &&
                                    !Route.sidechain &&
                                    Route.label !== "developer_challenge"
                                  ) {
                                    return (
                                      <Menu.ItemGroup
                                        className="mr-3  developer_challenge_box" 
                                        style={{display: 'block',}}
                                        key={Route.label}
                                        title={
                                          <span
                                            style={{
                                              display: "inline-block",
                                              width: "50%"
                                            }}
                                            onClick={() => {
                                              this.props.changeDrawerFun();
                                              window.open(Route.url, "_blank");
                                            }}
                                          >
                                            <span
                                              key={Route.url}
                                              className="dropdown-item text-uppercase"
                                              // href={Route.url}
                                            >
                                              {Route.icon && (
                                                <i
                                                  className={
                                                    Route.icon + " mr-2"
                                                  }
                                                />
                                              )}
                                              {tu(Route.label)}
                                              {Route.badge && (
                                                <Badge value={Route.badge} />
                                              )}
                                            </span>
                                            {Route.label === "NILE TESTNET" && (
                                              <span className="new-test-net">
                                                new
                                              </span>
                                            )}
                                          </span>
                                        }
                                      ></Menu.ItemGroup>
                                    );
                                  }
                                  if (
                                    !isUndefined(Route.url) &&
                                    !Route.sidechain &&
                                    Route.label == "developer_challenge"
                                  ) {
                                    return (
                                      <Menu.ItemGroup
                                        className="mr-3 d-inline-block developer_challenge_box"
                                        key={Route.label}
                                        title={
                                          <span
                                            style={{
                                              display: "inline-block",
                                              width: "50%"
                                            }}
                                            onClick={() => {
                                              this.props.changeDrawerFun();
                                              window.open(Route.url, "_blank");
                                            }}
                                          >
                                            <span
                                              key={
                                                Route.url + "_" + Route.label
                                              }
                                              className="dropdown-item text-uppercase"
                                              href={Route.url}
                                            >
                                              {Route.icon && (
                                                <i
                                                  className={
                                                    Route.icon + " mr-2"
                                                  }
                                                />
                                              )}
                                              {tu(Route.label)}
                                              {Route.badge && (
                                                <Badge value={Route.badge} />
                                              )}
                                            </span>
                                            <img
                                              src={require("../images/home/hot.svg")}
                                              title="hot"
                                              className="developer_challenge_hot"
                                            />
                                          </span>
                                        }
                                      ></Menu.ItemGroup>
                                    );
                                  }

                                  if (
                                    isUndefined(Route.url) &&
                                    Route.sidechain
                                  ) {
                                    const sidechainTab = (
                                      <a
                                        href="javascript:"
                                        key={Route.label}
                                        className="dropdown-item text-uppercase"
                                        style={{
                                          display: "inline-block",
                                          width: "50%"
                                        }}
                                        onClick={() => {
                                          this.props.changeDrawerFun();
                                          this.netSelectChange(
                                            IS_MAINNET ? "sunnet" : "mainnet"
                                          );
                                        }}
                                      >
                                        {Route.icon && (
                                          <i className={Route.icon + " mr-2"} />
                                        )}
                                        {IS_MAINNET
                                          ? tu("Side_Chain")
                                          : tu("Main_Chain")}
                                      </a>
                                    );
                                    return sidechainTab;
                                  }
                                  if (
                                    !isUndefined(Route.enurl) ||
                                    !isUndefined(Route.zhurl)
                                  ) {
                                    return (
                                      <Menu.ItemGroup
                                        key={Route.label}
                                        className="dropdown-item text-uppercase"
                                        href={
                                          activeLanguage == "zh"
                                            ? Route.zhurl
                                            : Route.enurl
                                        }
                                        title={
                                          <span
                                            style={{
                                              display: "inline-block",
                                              width: "50%"
                                            }}
                                            onClick={() => {
                                              this.props.changeDrawerFun();
                                              activeLanguage == "zh"
                                                ? window.open(
                                                    Route.zhurl,
                                                    "_blank"
                                                  )
                                                : window.open(
                                                    Route.enurl,
                                                    "_blank"
                                                  );
                                            }}
                                          >
                                            {Route.icon && (
                                              <i
                                                className={Route.icon + " mr-2"}
                                              />
                                            )}
                                            {tu(Route.label)}
                                            {Route.badge && (
                                              <Badge value={Route.badge} />
                                            )}
                                          </span>
                                        }
                                      ></Menu.ItemGroup>
                                    );
                                  }
                                  return (
                                    <Menu.ItemGroup
                                      key={Route.label}
                                      className="dropdown-item text-uppercase"
                                      to={Route.path}
                                      title={
                                        <span
                                          className={
                                            currentRouter == Route.path
                                              ? "menu-single-tilte more-menu-single-tilte-style menu-active-tilte"
                                              : "menu-single-tilte more-menu-single-tilte-style"
                                          }
                                          style={{
                                            display: "inline-block",
                                            width: "50%"
                                          }}
                                          onClick={() => {
                                            this.props.changeDrawerFun();
                                            this.props.history.push(Route.path);
                                          }}
                                        >
                                          {Route.icon && (
                                            <i
                                              className={`${Route.icon} mr-2 fa_width`}
                                            />
                                          )}
                                          {tu(Route.label)}
                                          {Route.badge && (
                                            <Badge value={Route.badge} />
                                          )}
                                        </span>
                                      }
                                    ></Menu.ItemGroup>
                                  );
                                })}
                              </div>
                            );
                          })}
                      </div>
                    )}
                </span>
              </SubMenu>
            )
          )}
        </Menu>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    currentRouter: state.router.location.pathname,
    activeLanguage: state.app.activeLanguage,
    router: state.router
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false
})(withRouter(injectIntl(Menunavigation)));
