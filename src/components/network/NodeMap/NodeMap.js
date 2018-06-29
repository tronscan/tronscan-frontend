/* eslint-disable no-undef */
import React, {Component} from 'react';
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet/dist/leaflet-src.js";
import "leaflet.markercluster/dist/leaflet.markercluster-src.js";
import "leaflet-echarts/src/leaflet-echarts.js";
import "leaflet-echarts/lib/echarts.source.js";


export default class NodeMap extends Component {

  componentDidMount() {
    let {nodes} = this.props;
    console.log(nodes);
    let points=[];
    let geoCoord={};
    let data=[];
    for(let node in nodes){
    /*  if(nodes[node].city!=='') {
        points.push([nodes[node].lat,nodes[node].lng,node]);
        geoCoord[nodes[node].city] = [nodes[node].lng, nodes[node].lat];
        data.push({name: nodes[node].city, ip: nodes[node].ip});
      }
    */

        points.push([nodes[node].lat,nodes[node].lng,nodes[node].ip]);
        geoCoord[nodes[node].ip] = [nodes[node].lng, nodes[node].lat];
        data.push({name: nodes[node].ip, ip: nodes[node].ip});

    }
    console.log(points);
    console.log(geoCoord);
    console.log(data);
    var addressPoints = points;
    var map = L.map(this.$ref);
    var baseLayers =  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemtsaSIsImEiOiJjamhzbjFiZWYwNG9mM3ZwM3BpM2xudjBpIn0.BeVbGjUROg5szZiCmYZfnQ',
        {
          maxZoom: 18,
          minZoom: 1
        }).addTo(map);


    map.setView(L.latLng(37.550339, 13.114129), 1);
    var markers = L.markerClusterGroup();

    for (var i = 0; i < addressPoints.length; i++) {
      var a = addressPoints[i];
      var title = a[2];
      var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
      marker.bindPopup(title);
      markers.addLayer(marker);
    }

    map.addLayer(markers);

    var overlay = new L.echartsLayer(map, echarts);
    var chartsContainer=overlay.getEchartsContainer();
    var myChart=overlay.initECharts(chartsContainer);
    window.onresize = myChart.onresize;
    var option = {
      color: ['gold'],
      title : {

        x:'center',
        textStyle : {
          color: '#fff'
        }
      },
      tooltip : {
        trigger: 'item',
        formatter: '{b}'
      },

      series : [
        {
          name: '',
          type: 'map',
          roam: true,
          hoverable: false,
          mapType: 'none',
          itemStyle:{
            normal:{
              borderColor:'rgba(100,149,237,1)',
              borderWidth:0.5,
              areaStyle:{
                color: '#1b1b1b'
              }
            }
          },
          data:[],

          geoCoord: geoCoord
        },
        {
          name: '',
          type: 'map',
          mapType: 'none',
          data:[],

          markPoint : {
            symbol:'emptyCircle',
            symbolSize : function (v){
              return 10 + v/10
            },
            effect : {
              show: true,
              shadowBlur : 0
            },
            itemStyle:{
              normal:{
                label:{show:false}
              },
              emphasis: {
                label:{position:'top'}
              }
            },
            data : data
          }
        }
      ]
    };
    overlay.setOption(option);

  }

  componentDidUpdate() {

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
