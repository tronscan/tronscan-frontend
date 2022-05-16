import React, { Component } from "react";
import xhr from "axios/index";
import { connect } from "react-redux";
import { loadNodes } from "../../actions/network";
import { filter, maxBy, sortBy, sumBy } from "lodash";
import { tu } from "../../utils/i18n";
import { TronLoader } from "../common/loaders";
import { NodeMapAsync } from "./NodeMap/async";
import { getQueryParam } from "../../utils/url";
import { WidgetIcon } from "../common/Icon";
import BarReact from "../common/BarChart";
import { API_URL, IS_MAINNET } from "../../constants";

class Nodes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAllCountries: false,
      size: 5,
      nodes: [],
      syncStatus: "waiting",
      show3D: getQueryParam(props.location, "mode") === "3d"
    };
  }

  buildNodeList = () => {
    let { nodes } = this.state;

    let nodesByCountry = {};
    for (let node of nodes) {
      if (!nodesByCountry[node.country]) {
        nodesByCountry[node.country] = {
          name: node.country,
          nodes: [],
          total: 0
        };
      }
      nodesByCountry[node.country].nodes.push(node);
      nodesByCountry[node.country].total++;
    }

    let countries = Object.values(nodesByCountry);
    countries = sortBy(countries, c => c.total);
    countries = filter(countries, c => c.name !== "");
    countries.reverse();

    return countries;
  };

  setCountryHover = activeCountry => {
    this.setState({
      activeCountry
    });
  };

  renderList() {
    let { showAllCountries, size } = this.state;
    let { nodes } = this.state;
    let shownCountries = this.buildNodeList();

    if (!showAllCountries) {
      shownCountries = shownCountries.slice(0, size);
    }

    if (nodes.length === 0) {
      return (
        <div className="d-flex justify-content-center p-4">
          <TronLoader />
        </div>
      );
    }

    return (
      <ul className="list-group list-group-flush">
        {shownCountries.map((country, index) => (
          <li key={country.name} className="list-group-item d-flex">
            {country.name}
            <span className="ml-auto">{country.total}</span>
          </li>
        ))}
      </ul>
    );
  }

  loadNodes = async () => {
    // let {nodes, status} = await Client.getNodeLocations();
    let { data } = await xhr.get(`${API_URL}/api/nodemap`);
    this.setState({
      nodes: data.data,
      syncStatus: null
    });
  };

  componentDidMount() {
    this.loadNodes();
  }

  render() {
    let { nodes, syncStatus } = this.state;
    let countries = this.buildNodeList();
    if (syncStatus === "waiting_for_first_sync") {
      return (
        <main className="container header-overlap">
          <div className="card">
            <TronLoader>{tu("first_node_sync_message")}</TronLoader>
          </div>
        </main>
      );
    }

    if (nodes.length === 0) {
      return (
        <main className="container header-overlap">
          <div className="card">
            <TronLoader>{tu("loading_nodes")}</TronLoader>
          </div>
        </main>
      );
    }

    return (
      <main className="container header-overlap _nodemap">
        <div className="row">
          <div className="col-md-6">
            <div className="card h-100 text-left widget-icon bg-line_red bg-image_node">
              <div className="card-body _node" style={{ marginLeft: "50px" }}>
                <h3 className="text-secondary">{nodes.length}</h3>
                {tu("nodes")}
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-3 mt-md-0">
            <div className="card h-100 text-left widget-icon bg-line_green bg-image_nodest">
              <div className="card-body _node" style={{ marginLeft: "50px" }}>
                {countries.length > 0 ? (
                  <h3 className="text-primary">
                    {maxBy(countries, c => c.total).name}
                  </h3>
                ) : (
                  <h3 className="text-primary">Unknown</h3>
                )}
                {tu("most_nodes")}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="card" style={{ padding: "20px" }}>
              <NodeMapAsync nodes={nodes} countries={countries} />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body _node">
                <h5 className="card-title text-center">
                  {tu("nodes_ranking")}
                  <br />
                  {tu("split_by_country")}
                </h5>
                <div style={IS_MAINNET ? { height: 500 } : { height: 250 }}>
                  {}
                  {countries === null ? (
                    <TronLoader />
                  ) : (
                    <BarReact
                      style={IS_MAINNET ? { height: 500 } : { height: 250 }}
                      data={countries}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="card">
                    <table className="table table-hover table-striped bg-white m-0">
                      <thead className="thead-dark">
                      <tr>
                        <th style={{width: 150}}>{tu("IP")}</th>
                        <th className="text-nowrap d-none d-lg-table-cell">{tu("Hostname")}</th>
                        <th className="text-right text-nowrap d-none d-sm-table-cell">{tu("height")}</th>
                        <th style={{width: 50}} className="text-center text-nowrap">{tu("GRPC")}</th>
                        <th style={{width: 100}}
                            className="text-center text-nowrap d-none d-md-table-cell">{tu("GRPC m/s")}</th>
                        <th style={{width: 100}} className="text-right text-nowrap">{tu("Last Update")}</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        nodes.map((node, index) => (
                            <tr key={index}>
                              <td>{node.ip}</td>
                              <td className="text-nowrap d-none d-lg-table-cell">
                                <div className="text-truncate" style={{maxWidth: 300}}>
                                  {node.hostname}
                                </div>
                              </td>
                              <td className="text-right text-nowrap d-none d-sm-table-cell">
                                {node.lastBlock === 0 ? '-' : node.lastBlock}
                              </td>
                              <td className="text-center text-nowrap d-none d-sm-table-cell">
                                {node.grpcEnabled ? <span key="no" className="text-success"><i
                                    className="fas fa-circle"/></span> : null}
                              </td>
                              <td className="text-right text-nowrap">
                                {
                                  node.grpcEnabled ? (node.grpcResponseTime + ' ms') : '-'
                                }
                              </td>
                              <td className="text-right text-nowrap">
                                <TimeAgo date={node.lastSeen}/>
                              </td>
                            </tr>
                        ))
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              */}
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    // nodes: state.network.nodes,
  };
}

const mapDispatchToProps = {
  loadNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(Nodes);
