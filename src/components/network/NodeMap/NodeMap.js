/* eslint-disable no-undef */
import React, {Component} from 'react';
import L from "leaflet";

import "leaflet.markercluster/dist/leaflet.markercluster-src.js";
import "leaflet.markercluster.placementstrategies/dist/leaflet-markercluster.placementstrategies.js";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant.js";
import {isUndefined} from "lodash";
import {MapStyle} from "./MapConfig";

export default class NodeMap extends Component {

  updateMap = () => {
    let {nodes} = this.props;

    let colors = [
      '#e41a1c',
      '#377eb8',
      '#4daf4a',
      '#984ea3',
      '#ff7f00',
      '#ffff33',
    ];

    let circleStyle = function (country) {

      return {
        fillColor: '#343a40',
        radius: 12,
        stroke: true,
        color: '#FFF',
        weight: 2.5,
        opacity: 0.7,
        fillOpacity: 1,
        className: 'marker',
        title: country.name,
      };
    };

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
          cluster: L.markerClusterGroup({
            // maxClusterRadius: 10,
            spiderLegPolylineOptions: {weight: 0},
            clockHelpingCircleOptions: {
              weight: .7,
              opacity: 1,
              color: 'black',
              fillColor: '#343a40',
              dashArray: '10 5'
            },

            elementsPlacementStrategy: 'concentric',
            helpingCircles: true,

            spiderfyDistanceSurplus: 25,
            spiderfyDistanceMultiplier: 1,

            elementsMultiplier: 1.4,
            firstCircleElements: 8,
          }),
        }
      }

      let country = nodesByCountry[key];
      if (isUndefined(country.latitude) || isUndefined(country.longitude)) {
        continue;
      }

      country.count++;

      let circleMarker = L.circleMarker([
          country.latitude,
          country.longitude],
        circleStyle(country));

      circleMarker.on("click", cm => {
        // console.log("cm", cm);
      });

      let toolTip = L.tooltip();
      toolTip.setContent(`
        <table>
            <tr>
              <td class="font-weight-bold">City:</td>
              <td>${node.city}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">IP:</td>
              <td>${node.ip}</td>
            </tr>
        </table>`);

      circleMarker.bindTooltip(toolTip);

      country.cluster.addLayer(circleMarker);
    }

    this.clusters.clearLayers();
    for (let country of Object.values(nodesByCountry)) {
      this.clusters.addLayer(country.cluster);
    }
  };

  componentDidMount() {
    this.map = L.map(this.$ref)
      .setView([9.622414142924818, 10.82031250000001], 2);
    this.clusters = L.layerGroup();
    this.clusters.addTo(this.map);

    L.gridLayer.googleMutant({
      styles: MapStyle,
      maxZoom: 20,
      type:'roadmap'
    }).addTo(this.map);


    // this.map.setMaxBounds(this.map.getBounds());
    this.map.fitBounds(this.map.getBounds());

    window.globalMap = this.map;

    this.updateMap();
  }

  componentDidUpdate() {
    this.updateMap();
  }

  render() {

    let {className} = this.props;

    return (
      <div
        style={{height: 600}}
        className={className + " map-2d"}
        ref={(cmp) => this.$ref = cmp}/>
    )
  }
}
