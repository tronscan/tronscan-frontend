/*eslint-disable no-script-url*/
import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadNodes} from "../../actions/network";
import {filter, maxBy, sortBy, sumBy} from "lodash";
import {tu} from "../../utils/i18n";
import {TronLoader} from "../common/loaders";
import {GlobeMapAsync, NodeMapAsync} from "./NodeMap/async";
import {getQueryParam} from "../../utils/url";
import {Client} from "../../services/api";
import TimeAgo from "react-timeago";
import {WidgetIcon} from "../common/Icon";
import BarReact from "../common/BarChart";
import {IS_DESKTOP} from "../../constants";

class Nodes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showAllCountries: false,
      size: 5,
      nodes: [],
      syncStatus: "waiting",
      show3D: getQueryParam(props.location, "mode") === "3d",
    };
  }

  buildNodeList = () => {
    let {nodes} = this.state;

    let nodesByCountry = {};
    for (let node of nodes) {
      if (!nodesByCountry[node.country]) {
        nodesByCountry[node.country] = {
          name: node.country,
          nodes: [],
          total: 0,
        }
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

  setCountryHover = (activeCountry) => {
    this.setState({
      activeCountry
    });
  };

  renderList() {
    let {showAllCountries, size} = this.state;
    let {nodes} = this.state;
    let shownCountries = this.buildNodeList();

    if (!showAllCountries) {
      shownCountries = shownCountries.slice(0, size);
    }

    if (nodes.length === 0) {
      return (
        <div className="d-flex justify-content-center p-4">
          <TronLoader/>
        </div>
      );
    }

    return (
      <ul className="list-group list-group-flush">
        {
          shownCountries.map((country, index) => (
            <li key={country.name} className="list-group-item d-flex">
              {country.name}
              <span className="ml-auto">
                {country.total}
              </span>
            </li>
          ))
        }
      </ul>
    );
  }

  loadNodes = async () => {
    let {nodes, status} = await Client.getNodeLocations();

    this.setState({
      nodes,
      syncStatus: status,
    });
  };

  componentDidMount() {
    this.loadNodes();

  }

  render() {
    let {showAllCountries, size, show3D} = this.state;

    let {nodes, syncStatus} = this.state;
    let countries = this.buildNodeList();
    if (syncStatus === "waiting_for_first_sync") {
      return (
        <main className="container header-overlap">
          <div className="card">
            <TronLoader>
              {tu("first_node_sync_message")}
            </TronLoader>
          </div>
        </main>
      );
    }

    if (nodes.length === 0) {
      return (
        <main className="container header-overlap">
          <div className="card">
            <TronLoader>
              {tu("loading_nodes")}
            </TronLoader>
          </div>
        </main>
      );
    }

    return (
      show3D ?
        <GlobeMapAsync nodes={nodes} countries={countries}/> :
        <main className="container header-overlap">
          <div className="row">
            <div className="col-md-6">
              <div className="card h-100 text-center widget-icon">
                <WidgetIcon className="fa fa-server"/>
                <div className="card-body">
                  <h3 className="text-secondary">
                    {nodes.length}
                  </h3>
                  {tu("nodes")}
                </div>
              </div>
            </div>

            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card h-100 text-center widget-icon">
                <WidgetIcon className="fa fa-globe text-primary"/>
                <div className="card-body">
                  {
                    countries.length > 0 ?
                      <h3 className="text-primary">
                        {maxBy(countries, c => c.total).name}
                      </h3> :
                      <h3 className="text-primary">
                        Unknown
                      </h3>
                  }
                  {tu("most_nodes")}
                </div>
              </div>
            </div>
          </div>
          {
            !IS_DESKTOP &&
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="card">
                    <NodeMapAsync nodes={nodes} countries={countries}/>
                  </div>
                </div>
              </div>
          }
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center"> {tu("nodes_ranking")}</h5>
                  <div style={{height: 500}}>
                    {
                      countries === null ?
                        <TronLoader/> :
                        <BarReact style={{height: 500}} data={countries}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    )
  }
}


function mapStateToProps(state) {
  return {
    // nodes: state.network.nodes,
  };
}

const mapDispatchToProps = {
  loadNodes,
};

export default connect(mapStateToProps, mapDispatchToProps)(Nodes)
