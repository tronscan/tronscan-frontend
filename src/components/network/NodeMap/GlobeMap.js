/* eslint-disable */

import React, {Fragment} from "react";
import {Globe} from "../../../lib/globe/globe.js";
import {sortBy, sumBy} from "lodash";
import {TronLoader} from "../../common/loaders";

require("script-loader!../../../lib/globe/Detector.js");

export default class GlobeMap extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      showAllCountries: false,
      size: 5,
    };
  }

  updateData() {
    let {nodes} = this.props;

    let nodesByCountry = {};
    for (let node of nodes) {
      let key = `${node.country}-${node.city}`;
      if (!nodesByCountry[key]) {
        nodesByCountry[key] = {
          name: node.country,
          city: node.city,
          country: node.country,
          count: 0,
          longitude: node.lng,
          latitude: node.lat,
        }
      }
      nodesByCountry[key].count++;
    }

    if (Object.values(nodesByCountry).length === 0) {
      return;
    }

    let highest = sortBy(Object.values(nodesByCountry), n => n.count * -1)[0].count;

    let data = [];

    for (let country of Object.values(nodesByCountry)) {
      data.push(country.latitude);
      data.push(country.longitude);
      data.push((country.count / highest));
    }

    this.globe.clearData();
    this.globe.addData(data, {
      format: 'magnitude',
    });

    this.globe.createPoints();
    this.globe.animate();
  }

  componentDidUpdate() {
    this.updateData();
  }

  componentWillUnmount() {
    this.globe.stop();
  }

  componentDidMount() {

    // if (!Detector.webgl) {
    //   Detector.addGetWebGLMessage();
    // } else {
      this.globe = new Globe(this.$ref);
    // }
    this.updateData();
  }

  renderList() {
    let {nodes, countries} = this.props;

    // if (!showAllCountries) {
    //   shownCountries = shownCountries.slice(0, size);
    // }

    if (nodes.length === 0) {
      return (
        <div className="d-flex justify-content-center p-4">
          <TronLoader />
        </div>
      );
    }

    return (
      <table style={{fontSize: 20}}>
        <thead className="border-bottom">
          <th className="font-weight-bold">
            Total
          </th>
          <th className="text-left pl-2">
            <b>{sumBy(countries, c => c.total)}</b>
          </th>
        </thead>
        {
          countries.map((country, index) => (
            <tr key={country.name}>
              <td>
                {country.name}
              </td>
              <td className="text-left pl-2">
                <b>{country.total}</b>
              </td>
            </tr>
          ))
        }
      </table>
    );
  }

  render() {

    return (
      <Fragment>
        <div className="node-map" ref={(cmp) => this.$ref = cmp} />
        <div className="text-white position-absolute text-right" style={{ zIndex: 999, right: 50, top: 160 }}>
          {this.renderList()}
        </div>
      </Fragment>
    )
  }
};
