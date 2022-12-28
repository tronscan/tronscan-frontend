/* eslint-disable no-undef */
import React, {Component} from 'react';
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "../../../styles/marker-cluster.scss";

import "leaflet/dist/leaflet-src.js";
import "leaflet.markercluster/dist/leaflet.markercluster-src.js";

import "leaflet-echarts/src/leaflet-echarts.js";
import "leaflet-echarts/lib/echarts.source.js";

import config from '../../common/chart.config.js'

export default class NodeMap extends Component {

  componentDidMount() {

    let {nodes} = this.props;
    let points = [];
    let geoCoord = {};
    let data = [];
    config.mapChart.series[0].geoCoord = {};
    config.mapChart.series[1].markPoint.data = [];
    if (nodes.length) {
      for (let node of nodes) {
        points.push([node.lat, node.lng, node.ip]);
        geoCoord[node.ip] = [node.lng, node.lat];
        data.push({name: node.ip, ip: node.ip});
      }

      let addressPoints = points;
      let map = L.map(this.$ref, {
        maxZoom: 18,
        minZoom: 2,
        maxBounds: [
          //south west
          [-90, -180],
          //north east
          [90, 180]
        ],
      });
      let southWest = L.latLng(-90, -120);
      let northEast = L.latLng(90, 120);
      let bounds = L.latLngBounds(southWest, northEast);

      let baseLayers = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJvbm5ldHdvcmsiLCJhIjoiY2prODN1cms2MDEwbzNxcHE3bzJkdTZ6ayJ9.QyBCtvwwMp8RK7V3kTbr_Q').addTo(map);


      map.setView(L.latLng(0, 13.114129), 1);
      let markers = L.markerClusterGroup();

      for (let i = 0; i < addressPoints.length; i++) {
        let a = addressPoints[i];
        let title = a[2];
        let marker = L.marker(new L.LatLng(a[0], a[1]), {
          title: title
        });
        marker.bindPopup(title);
        markers.addLayer(marker);
      }

      map.addLayer(markers);

      let overlay = new L.echartsLayer(map, echarts);
      let chartsContainer = overlay.getEchartsContainer();
      let myChart = overlay.initECharts(chartsContainer);
      window.onresize = myChart.onresize;

      config.mapChart.series[0].geoCoord = geoCoord;
      config.mapChart.series[1].markPoint.data = data;

      overlay.setOption(config.mapChart);
    }
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
