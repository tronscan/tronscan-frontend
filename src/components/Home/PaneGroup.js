import React, { Component } from "react";
import { connect } from "react-redux";
import xhr from "axios/index";
import { injectIntl } from "react-intl";
import { doSearch, getSearchType } from "../../services/search";
import CountUp from "react-countup";
import { Client, Client20 } from "../../services/api";
import { Link } from "react-router-dom";

import RecentBlocks from "./RecentBlocks";
import { KEY_ENTER } from "../../utils/constants";
import { withTimers } from "../../utils/timing";
import isMobile from "../../utils/isMobile";
import RecentTransfers from "./RecentTransfers";
import { tu } from "../../utils/i18n";
import { toastr } from "react-redux-toastr";
import { HrefLink } from "../common/Links";
import { TronLoader } from "../common/loaders";
import {
  LineReactHighChartAdd,
  LineReactHighChartTx
} from "../common/LineCharts";
import { API_URL, IS_MAINNET } from "../../constants";
import { setWebsocket, setWebsocketSun } from "../../actions/account";
import Lockr from "lockr";
import { Icon, Divider, Tooltip, Tag } from "antd";
import ApiHome from "../../services/homeApi";
import MobilePanelGroup from "./MobilePaneGroup";
// import BigNumber from "bignumber.js"

@connect(
  state => {
    return {
      blocks: state.blockchain.blocks,
      account: state.app.account,
      theme: state.app.theme,
      activeLanguage: state.app.activeLanguage,
      wsdata: state.account.wsdata,
      websocket: state.account.websocket,
      wsdataSun: state.account.wsdataSun,
      websocketSun: state.account.websocketSun
    };
  },
  {
    setWebsocket,
    setWebsocketSun
  }
)
@withTimers
@injectIntl
export default class panelGroup extends Component {
  constructor() {
    super();
    this.listener = null;
    this.state = {
      isExpand: false,
      mainnetData: {
        onlineNodes: 0,
        blockHeight: 0,
        tps: 0,
        maxTps: 0,
        totalAccounts: 0,
        transactionPerDay: 0,
        startblockHeight: 0,
        startTps: 0
      },
      sunnetData: {
        onlineNodes: 0,
        blockHeight: 0,
        tps: 0,
        maxTps: 0,
        totalAccounts: 0,
        transactionPerDay: 0,
        startblockHeight: 0,
        startTps: 0
      },
      complexData: {
        totalAccounts: 0,
        transactionPerDay: 0,
        onlineNodes: 0,
        tps: 0
      }
    };
  }

  async loadHomepageBundle(type) {
    let data = await ApiHome.getHomePage(type);
    Lockr.set("dataEth", data.priceETH);
    Lockr.set("dataEur", data.priceEUR);
    let { mainnetData, sunnetData, complexData, onlineNodesSun } = this.state;
    let Data = {
      onlineNodes: data.node && data.node.total,
      maxTps: data.tps.data.maxTps ? data.tps.data.maxTps : 0,
      tps: data.tps.data.currentTps ? data.tps.data.currentTps : 0,
      blockHeight: data.tps.data.blockHeight ? data.tps.data.blockHeight : 0,
      transactionPerDay: data.yesterdayStat.data[0].newTransactionSeen
    };
    if (type == "mainnet") {
      this.setState({
        mainnetData: Object.assign(mainnetData, Data),
        complexData: {
          ...complexData,
          onlineNodes: sunnetData.onlineNodes + Data.onlineNodes,
          transactionPerDay:
            sunnetData.transactionPerDay + Data.transactionPerDay,
          tps: sunnetData.tps + Data.tps
        }
      });
    } else if (type == "sunnet") {
      this.setState({
        sunnetData: Object.assign(sunnetData, Data),
        complexData: {
          ...complexData,
          onlineNodes: Data.onlineNodes + mainnetData.onlineNodes,
          transactionPerDay:
            mainnetData.transactionPerDay + Data.transactionPerDay,
          tps: mainnetData.tps + Data.tps
        }
      });
    }
  }

  async loadAccounts(type, options) {
    let { rangeTotal } = await ApiHome.getHomeAccounts(type, options);
    let { mainnetData, sunnetData, complexData } = this.state;
    if (type == "mainnet") {
      this.setState({
        mainnetData: { ...mainnetData, totalAccounts: rangeTotal },
        complexData: {
          ...complexData,
          totalAccounts: sunnetData.totalAccounts + rangeTotal
        }
      });
    } else {
      this.setState({
        sunnetData: { ...sunnetData, totalAccounts: rangeTotal },
        complexData: {
          ...complexData,
          totalAccounts: mainnetData.totalAccounts + rangeTotal
        }
      });
    }
  }

  async componentDidMount() {
    const { intl, setWebsocketSun } = this.props;
    const { mainnetData, sunnetData, complexData } = this.state;
    IS_MAINNET && setWebsocketSun();
    IS_MAINNET && (await this.loadAccounts("mainnet", { limit: 1 }));
    await this.loadAccounts("sunnet", { limit: 1 });

    this.reconnect();
    IS_MAINNET && (await this.loadHomepageBundle("mainnet"));
    await this.loadHomepageBundle("sunnet");
  }

  async componentDidUpdate(prevProps) {
    const { wsdata, wsdataSun } = this.props;

    if (wsdata !== prevProps.wsdata) {
      this.reconnect();
    }
    if (wsdataSun != prevProps.wsdataSun) {
      this.reconnectSun();
    }
  }

  componentWillUnmount() {
    let { websocketSun } = this.props;
    if (websocketSun) {
      websocketSun.close();
      Lockr.set("websocketSun", "close");
    }
  }

  reconnect(type) {
    const { wsdata, wsdataSun, websocket, setWebsocket } = this.props;
    const {
      blockHeight,
      tps,
      mainnetData,
      sunnetData,
      complexData
    } = this.state;
    const info = wsdata.type === "tps" && wsdata.data;

    if (IS_MAINNET) {
      let data = {
        ...mainnetData,
        maxTps: info.maxTps ? info.maxTps : 0,
        tps: info.currentTps ? info.currentTps : 0,
        blockHeight: info.blockHeight ? info.blockHeight : 0,
        startblockHeight: mainnetData.blockHeight,
        startTps: mainnetData.tps
      };
      this.setState({
        mainnetData: data,
        complexData: {
          ...complexData,
          tps: data.tps + sunnetData.tps,
          startTps: complexData.tps
        }
      });
    } else {
      let data = {
        ...sunnetData,
        maxTps: info.maxTps ? info.maxTps : 0,
        tps: info.currentTps ? info.currentTps : 0,
        blockHeight: info.blockHeight ? info.blockHeight : 0,
        startblockHeight: sunnetData.blockHeight,
        startTps: sunnetData.tps
      };
      this.setState({
        sunnetData: data,
        complexData: {
          ...complexData,
          tps: data.tps + mainnetData.tps,
          startTps: complexData.tps
        }
      });
    }
  }

  reconnectSun() {
    const { wsdataSun, websocketSun } = this.props;
    const { blockHeight, tps, sunnetData } = this.state;

    const info = wsdataSun.type === "tps" && wsdataSun.data;
    let data = {
      ...sunnetData,
      maxTps: info.maxTps ? info.maxTps : 0,
      tps: info.currentTps ? info.currentTps : 0,
      blockHeight: info.blockHeight ? info.blockHeight : 0,
      startblockHeight: sunnetData.blockHeight,
      startTps: sunnetData.tps
    };
    this.setState({
      sunnetData: data
    });
  }

  expand() {
    let { isExpand } = this.state;
    this.setState({
      isExpand: !isExpand
    });
  }

  render() {
    let { intl, activeLanguage } = this.props;
    let { isExpand, mainnetData, sunnetData, complexData } = this.state;
    return (
      <div>
        {isMobile && (
          <MobilePanelGroup
            complexData={complexData}
            mainnetData={mainnetData}
            sunnetData={sunnetData}
          ></MobilePanelGroup>
        )}
        {!isMobile && (
          <div>
            {/* mainnet */}
            {IS_MAINNET && (
              <div className="panel-group ">
                <span
                  className="col-tag"
                  onClick={() => {
                    this.expand();
                  }}
                >
                  {isExpand ? tu("collapse") : tu("expand")}
                  <Icon type={isExpand ? "caret-up" : "caret-down"} />
                </span>
                <div className={isMobile ? "text-center mr-0 ml-0 mt-2" : "text-center mr-0 ml-0"}>
                  <div
                    className="col-12  card  pt-1 pl-0 pr-0"
                    style={{ border: "none", borderRadius: 0 }}
                  >
                    <div className="card-body row pt-3 pb-3 home-stats">
                      <div className="col-lg-1 col-md-2 col-xs-6"></div>
                      <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3 ">
                        <p className="m-0 panel-title">{tu("online_nodes")}</p>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "tooltip_onlineNodes"
                          })}
                        >
                          {complexData.onlineNodes != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                               separator=","
                                start={0}
                                end={complexData.onlineNodes}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Tooltip>
                      </div>

                      <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0 mb-md-3">
                        <p className="m-0 panel-title">{tu("block_height")}</p>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "tooltip_blockHeight"
                          })}
                        >
                          {mainnetData.blockHeight != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                                separator=","
                                start={mainnetData.startblockHeight}
                                end={mainnetData.blockHeight}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Tooltip>
                      </div>
                      <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3">
                        <p className="m-0 panel-title">
                          {tu("current_MaxTPS")}
                        </p>
                        <div
                          href="javascript:;"
                          className="hvr-underline-from-center hvr-underline-white text-muted"
                        >
                          {mainnetData.maxTps ? (
                            <h2>
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "tooltip_startTps"
                                })}
                              >
                                <span className="hover-red">
                                  <CountUp
                                    separator=","
                                    start={complexData.startTps}
                                    end={complexData.tps}
                                    duration={2}
                                  />
                                </span>
                              </Tooltip>
                              /
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "tooltip_tps"
                                })}
                              >
                                <span className="hover-red">
                                  <CountUp
                                    separator=","
                                    start={0}
                                    end={mainnetData.maxTps}
                                    duration={1}
                                  />
                                </span>
                              </Tooltip>
                            </h2>
                          ) : (
                            <h2>-/-</h2>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-4 col-xs-12">
                        <p className="m-0 panel-title">
                          {tu("transactions_last_day")}
                        </p>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "tooltip_transactionPerDay"
                          })}
                        >
                          {complexData.transactionPerDay != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                                separator=","
                                start={0}
                                end={complexData.transactionPerDay}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Tooltip>
                      </div>
                      <div className="col-lg-2 col-md-4 col-xs-12">
                        <p className="m-0 panel-title">
                          {tu("total_accounts")}
                        </p>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "tooltip_accounts"
                          })}
                        >
                          {complexData.totalAccounts != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                                separator=","
                                start={0}
                                end={complexData.totalAccounts}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Tooltip>
                      </div>
                     
                    </div>
                  </div>
                </div>
                {
                  <div
                    className={
                      isExpand
                        ? "hidden-panel hidden-panel-height"
                        : "hidden-panel"
                    }
                  >
                    {/* hiden mainnet */}
                    <Divider orientation="left">{tu("main_chain")}</Divider>
                    <div className="text-center mr-0 ml-0 mt-2">
                      <div
                        className="col-12  card  pt-1 pl-0 pr-0"
                        style={{ border: "none", borderRadius: 0 }}
                      >
                        <div className="card-body row pt-2 pb-2 home-stats">
                        <div className="col-lg-1 col-md-2 col-xs-6"></div>
                          <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3 ">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_onlineNodes_mainnet"
                              })}
                            >
                              <Link
                                to="/blockchain/nodes"
                                className="hvr-underline-from-center hvr-underline-white text-muted"
                              >
                                {mainnetData.onlineNodes != 0 ? (
                                  <h2 className="hover-red">
                                    <CountUp
                                      separator=","
                                      start={0}
                                      end={mainnetData.onlineNodes}
                                      duration={1}
                                    />
                                  </h2>
                                ) : (
                                  <h2>-</h2>
                                )}
                              </Link>
                            </Tooltip>
                          </div>

                          <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0 mb-md-3">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_blockHeight_mainnet"
                              })}
                            >
                              <Link
                                to="/blockchain/blocks"
                                className="hvr-underline-from-center hvr-underline-white text-muted"
                              >
                                {mainnetData.blockHeight != 0 ? (
                                  <h2 className="hover-red">
                                    <CountUp
                                      separator=","
                                      start={mainnetData.startblockHeight}
                                      end={mainnetData.blockHeight}
                                      duration={1}
                                    />
                                  </h2>
                                ) : (
                                  <h2>-</h2>
                                )}
                              </Link>
                            </Tooltip>
                          </div>
                          <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3">
                            <div
                              href="javascript:;"
                              className="hvr-underline-from-center hvr-underline-white text-muted"
                            >
                              {mainnetData.maxTps ? (
                                <h2>
                                  <Tooltip
                                    title={intl.formatMessage({
                                      id: "tooltip_startTps_mainnet"
                                    })}
                                  >
                                    <span className="hover-red">
                                      <CountUp
                                        separator=","
                                        start={mainnetData.startTps}
                                        end={mainnetData.tps}
                                        duration={2}
                                      />
                                    </span>
                                  </Tooltip>
                                  /
                                  <Tooltip
                                    title={intl.formatMessage({
                                      id: "tooltip_tps_mainnet"
                                    })}
                                  >
                                    <span className="hover-red">
                                      <CountUp
                                        separator=","
                                        start={0}
                                        end={mainnetData.maxTps}
                                        duration={1}
                                      />
                                    </span>
                                  </Tooltip>
                                </h2>
                              ) : (
                                <h2>-/-</h2>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-2 col-md-4 col-xs-12">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_transactionPerDay_mainnet"
                              })}
                            >
                              <Link
                                to="/blockchain/transactions"
                                className="hvr-underline-from-center hvr-underline-white text-muted"
                              >
                                {mainnetData.transactionPerDay != 0 ? (
                                  <h2 className="hover-red">
                                    <CountUp
                                      separator=","
                                      start={0}
                                      end={mainnetData.transactionPerDay}
                                      duration={1}
                                    />
                                  </h2>
                                ) : (
                                  <h2>-</h2>
                                )}
                              </Link>
                            </Tooltip>
                          </div>
                          <div className="col-lg-2 col-md-4 col-xs-12">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_accounts_mainnet"
                              })}
                            >
                              <Link
                                to="/blockchain/accounts"
                                className="hvr-underline-from-center hvr-underline-white text-muted"
                              >
                                {mainnetData.totalAccounts != 0 ? (
                                  <h2 className="hover-red">
                                    <CountUp
                                      separator=","
                                      start={0}
                                      end={mainnetData.totalAccounts}
                                      duration={1}
                                    />
                                  </h2>
                                ) : (
                                  <h2>-</h2>
                                )}
                              </Link>
                            </Tooltip>
                          </div>
                         
                        </div>
                      </div>
                    </div>
                    {/* hiden sun network */}
                    <Divider orientation="left">{tu("sun_network")}</Divider>
                    <div className="text-center mr-0 ml-0 mt-2">
                      <div
                        className="col-12  card  pt-1 pl-0 pr-0"
                        style={{ border: "none", borderRadius: 0 }}
                      >
                        <div className="card-body row pt-2 pb-2 home-stats">
                        <div className="col-lg-1 col-md-2 col-xs-6"></div>
                          <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3 ">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_onlineNodes_sunnet"
                              })}
                            >
                              {sunnetData.onlineNodes != 0 ? (
                                <h2 className="hover-red">
                                  <CountUp
                                    separator=","
                                    start={0}
                                    end={sunnetData.onlineNodes}
                                    duration={1}
                                  />
                                </h2>
                              ) : (
                                <h2>-</h2>
                              )}
                            </Tooltip>
                          </div>

                          <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0 mb-md-3">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_blockHeight_sunnet"
                              })}
                            >
                              {sunnetData.blockHeight != 0 ? (
                                <h2 className="hover-red">
                                  <CountUp
                                    separator=","
                                    start={sunnetData.startblockHeight}
                                    end={sunnetData.blockHeight}
                                    duration={1}
                                  />
                                </h2>
                              ) : (
                                <h2>-</h2>
                              )}
                            </Tooltip>
                          </div>
                          <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3">
                            <div
                              href="javascript:;"
                              className="hvr-underline-from-center hvr-underline-white text-muted"
                            >
                              {sunnetData.maxTps ? (
                                <h2>
                                  <Tooltip
                                    title={intl.formatMessage({
                                      id: "tooltip_startTps_sunnet"
                                    })}
                                  >
                                    <span className="hover-red">
                                      <CountUp
                                         separator=","
                                        start={sunnetData.startTps}
                                        end={sunnetData.tps}
                                        duration={2}
                                      />
                                    </span>
                                  </Tooltip>
                                  /
                                  <Tooltip
                                    title={intl.formatMessage({
                                      id: "tooltip_tps_sunnet"
                                    })}
                                  >
                                    <span className="hover-red">
                                      <CountUp
                                        separator=","
                                        start={0}
                                        end={sunnetData.maxTps}
                                        duration={1}
                                      />
                                    </span>
                                  </Tooltip>
                                </h2>
                              ) : (
                                <h2>-/-</h2>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-2 col-md-4 col-xs-12">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_transactionPerDay_sunnet"
                              })}
                            >
                              {sunnetData.transactionPerDay != 0 ? (
                                <h2 className="hover-red">
                                  <CountUp
                                    separator=","
                                    start={0}
                                    end={sunnetData.transactionPerDay}
                                    duration={1}
                                  />
                                </h2>
                              ) : (
                                <h2>-</h2>
                              )}
                            </Tooltip>
                          </div>
                          <div className="col-lg-2 col-md-4 col-xs-12">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_accounts_sunnet"
                              })}
                            >
                              {sunnetData.totalAccounts != 0 ? (
                                <h2 className="hover-red">
                                  <CountUp
                                    separator=","
                                    start={0}
                                    end={sunnetData.totalAccounts}
                                    duration={1}
                                  />
                                </h2>
                              ) : (
                                <h2>-</h2>
                              )}
                            </Tooltip>
                          </div>
                       
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            )}
            {/* sun network */}
            {!IS_MAINNET && (
              <div className="panel-group row text-center mr-0 ml-0 mt-2">
                <div
                  className="col-12  card  pt-1 pl-0 pr-0"
                  style={{ border: "none", borderRadius: 0 }}
                >
                  <div className="card-body row pt-3 pb-3 home-stats">
                    <div className="col-lg-1 col-md-2 col-xs-6"></div>
                    <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3">
                      <p className="m-0 panel-title">{tu("online_nodes")}</p>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "tooltip_onlineNodes_sunnet"
                        })}
                      >
                        <Link
                          to="/blockchain/nodes"
                          className="hvr-underline-from-center hvr-underline-white text-muted"
                        >
                          {sunnetData.onlineNodes != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                                separator=","
                                start={0}
                                end={sunnetData.onlineNodes}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Link>
                      </Tooltip>
                    </div>
                    <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0 mb-md-3">
                      <p className="m-0 panel-title">{tu("block_height")}</p>

                      <Tooltip
                        title={intl.formatMessage({
                          id: "tooltip_blockHeight_sunnet"
                        })}
                      >
                        <Link
                          to="/blockchain/blocks"
                          className="hvr-underline-from-center hvr-underline-white text-muted"
                        >
                          {sunnetData.blockHeight != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                                separator=","
                                start={sunnetData.startblockHeight}
                                end={sunnetData.blockHeight}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Link>
                      </Tooltip>
                    </div>
                    <div className="col-lg-2 col-md-4 col-xs-12 mb-lg-0  mb-md-3">
                      <p className="m-0 panel-title">{tu("current_MaxTPS")}</p>
                      <div
                        href="javascript:;"
                        className="hvr-underline-from-center hvr-underline-white text-muted"
                      >
                        {sunnetData.maxTps ? (
                          <h2 className="hover-red">
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_startTps_sunnet"
                              })}
                            >
                              <span className="hover-red">
                                <CountUp
                                   separator=","
                                  start={sunnetData.startTps}
                                  end={sunnetData.tps}
                                  duration={2}
                                />
                              </span>
                            </Tooltip>
                            /
                            <Tooltip
                              title={intl.formatMessage({
                                id: "tooltip_tps_sunnet"
                              })}
                            >
                              <span className="hover-red">
                                <CountUp
                                   separator=","
                                  start={0}
                                  end={sunnetData.maxTps}
                                  duration={1}
                                />
                              </span>
                            </Tooltip>
                          </h2>
                        ) : (
                          <h2 className="hover-red">-/-</h2>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-xs-12">
                      <p className="m-0 panel-title">
                        {tu("transactions_last_day")}
                      </p>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "tooltip_transactionPerDay_sunnet"
                        })}
                      >
                        <Link
                          to="/blockchain/transactions"
                          className="hvr-underline-from-center hvr-underline-white text-muted"
                        >
                          {sunnetData.transactionPerDay != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                                separator=","
                                start={0}
                                end={sunnetData.transactionPerDay}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Link>
                      </Tooltip>
                    </div>
                    <div className="col-lg-2 col-md-4 col-xs-12">
                      <p className="m-0 panel-title">{tu("total_accounts")}</p>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "tooltip_accounts_sunnet"
                        })}
                      >
                        <Link
                          to="/blockchain/accounts"
                          className="hvr-underline-from-center hvr-underline-white text-muted"
                        >
                          {sunnetData.totalAccounts != 0 ? (
                            <h2 className="hover-red">
                              <CountUp
                                separator=","
                                start={0}
                                end={sunnetData.totalAccounts}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                        </Link>
                      </Tooltip>
                    </div>
                  
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  list: {
    fontSize: 18
  },
  card: {
    border: "none",
    borderRadius: 0
  }
};

function mapStateToProps(state) {
  return {
    blocks: state.blockchain.blocks,
    account: state.app.account,
    theme: state.app.theme,
    activeLanguage: state.app.activeLanguage,
    wsdata: state.account.wsdata
  };
}

const mapDispatchToProps = {
  setWebsocket
};
