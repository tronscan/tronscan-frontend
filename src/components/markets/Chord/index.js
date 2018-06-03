import React from "react";
import {TimeAgo} from "react-timeago";
import chordMatrix from "./MatrixFactory";
import {compareKeys} from "../../../utils/obj";
import {tu} from "../../../utils/i18n";

const d3 = require("d3");

export default class Chord extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      master: {},
      selected_year: 2005,
      years: d3.range(2005, 1865, -5),
      data: [],
      filters: {},
    };

    this.ref = React.createRef();
  }

  componentDidMount() {

    let matrixFactory = new chordMatrix();
    let $this = this;

    let $el = this.ref.current;

    var size = [750, 750]; // SVG SIZE WIDTH, HEIGHT
    this.size = size;
    var marg = [50, 50, 50, 50]; // TOP, RIGHT, BOTTOM, LEFT
    var dims = []; // USABLE DIMENSIONS
    dims[0] = size[0] - marg[1] - marg[3]; // WIDTH
    dims[1] = size[1] - marg[0] - marg[2]; // HEIGHT

    var colors = d3.scale.ordinal().range([
      '#9C6744','#C9BEB9',
      '#CFA07E','#C4BAA1',
      '#C2B6BF','#121212',
      '#8FB5AA','#85889E',
      '#9C7989','#91919C',
      '#242B27','#212429',
      '#99677B','#36352B',
      '#33332F','#2B2B2E',
      '#2E1F13','#2B242A',
      '#918A59','#6E676C',
      '#6E4752','#6B4A2F',
      '#998476','#8A968D',
      '#968D8A','#968D96',
      '#CC855C','#967860',
      '#929488','#949278',
      '#A0A3BD','#BD93A1',
      '#65666B','#6B5745',
      '#6B6664','#695C52',
      '#56695E','#69545C',
      '#565A69','#696043',
      '#63635C','#636150',
      '#333131','#332820',
      '#302D30','#302D1F',
      '#2D302F','#CFB6A3',
      '#362F2A'
    ]);

    var chord = d3.layout.chord()
      .padding(0.02)
      .sortGroups(d3.descending)
      .sortSubgroups(d3.ascending);

    var matrix = matrixFactory
      .layout(chord)
      .filter(function (item, r, c) {
        return (item.importer1 === r.name && item.importer2 === c.name) || (item.importer1 === c.name && item.importer2 === r.name);
      })
      .reduce(function (items, r, c) {
        var value;
        if (!items[0]) {
          value = 0;
        } else {
          value = items.reduce(function (m, n) {
            // if (r === c) {
              return m + (n.flow1); // + n.flow2);
            // } else {
            //   return m + (n.importer1 === r.name ? n.flow1: n.flow2);
            // }
          }, 0);
        }
        return {
          value: value,
          data: items,
        };
      });

    var innerRadius = (dims[1] / 2) - 100;

    var arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + 20);

    var path = d3.svg.chord()
      .radius(innerRadius);

    var svg = d3.select($el).append("svg")
      .attr("class", "chart")
      .attr({width: size[0] + "px", height: size[1] + "px"})
      .attr("preserveAspectRatio", "xMinYMin")
      .attr("viewBox", "0 0 " + size[0] + " " + size[1]);

    var container = svg.append("g")
      .attr("class", "container")
      .attr("transform", "translate(" + ((dims[0] / 2) + marg[3]) + "," + ((dims[1] / 2) + marg[0]) + ")");
    //
    // var messages = svg.append("text")
    //   .attr("class", "messages")
    //   .attr("transform", "translate(10, 10)")
    //   .text("Updating...");

    this.drawChords = function (data) {

      container.selectAll("defs").remove();

// update defs
      var defs = svg
        .append('defs');

      for (let row of data) {
        let gradient = defs
          .append("radialGradient")
          .attr("id", "grad-" + row.importer1 + "__" + row.importer2);

        gradient
          .append("stop")
            .attr("stop", "stop1")
            .attr("offset", "20%")
            .style("stop-color", colors(row.importer1));

        gradient
          .append("stop")
            .attr("stop", "stop2")
            .attr("offset", "100%")
            .style("stop-color", colors(row.importer2));
      }


      {/*<radialGradient class="grad" gradientUnits="userSpaceOnUse" id="grad-ADA.rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS__JPY.rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS" cx="44.74345404945047" cy="187.74190613638905" r="373.36319475969975">*/}
        {/*<stop class="stop1" offset="20%" style="stop-color: rgb(126, 72, 153);"></stop>*/}
        {/*<stop class="stop2" offset="100%" style="stop-color: rgb(100, 150, 200);"></stop>*/}
      // </radialGradient>

      // messages.attr("opacity", 1);
      // messages.transition().duration(1000).attr("opacity", 0);

      matrix.data(data)
        .resetKeys()
        .addKeys(['importer1', 'importer2'])
        .update();

      var groups = container.selectAll("g.group")
        .data(matrix.groups(), d => d._id);

      var gEnter = groups.enter()
        .append("g")
        .attr("class", "group");

      gEnter.append("path")
        .style("pointer-events", "none")
        .style("fill", function (d) {
          return colors(d._id);
        })

        .attr("d", arc);

      gEnter.append("text")
        .attr("dy", ".35em")
        .attr("class", "market-label")
        .on("click", groupClick)
        .on("mouseover", dimChords)
        .on("mouseout", resetChords)
        .text((d) => d._id);

      groups.select("path")
        .transition().duration(2000)
        .attrTween("d", matrix.groupTween(arc));

      groups.select("text")
        .transition()
        .duration(2000)
        .attr("transform", (d) => {
          d.angle = (d.startAngle + d.endAngle) / 2;
          var r = "rotate(" + (d.angle * 180 / Math.PI - 90) + ")";
          var t = " translate(" + (innerRadius + 26) + ")";
          return r + t + (d.angle > Math.PI ? " rotate(180)" : " rotate(0)");
        })
        .attr("text-anchor", (d) => {
          return d.angle > Math.PI ? "end" : "begin";
        });

      groups.exit().select("text").attr("fill", "orange");
      groups.exit().select("path").remove();
      groups.exit().transition().duration(1000)
        .style("opacity", 0)
        .remove();

      var chords = container.selectAll("path.chord")
        .data(matrix.chords(), d => d._id);

      chords.enter().append("path")
        .attr("class", "chord")
        .style("fill", function (d) {
          return `url(#grad-${d.source._id}__${d.target._id})`;
        })
        // .style("stroke", function (d) {
        //   return `url(#grad-${d.source._id}__${d.target._id})`;
        // })
        .attr("d", path)
        .on("mouseover", chordMouseover)
        .on("mouseout", hideTooltip);

      chords.transition().duration(2000)
        .attrTween("d", matrix.chordTween(path));

      chords.exit().remove();

      function groupClick(d) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        $this.setState(state => ({
          filters: {
            ...state.filters,
            [d._id]: typeof state.filters[d._id] === 'undefined' ? false : !state.filters[d._id],
          }
        }));
        resetChords();
      }

      function chordMouseover(d) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        dimChords(d);
        d3.select("#tooltip").style("opacity", 1);
        // this.updateTooltip(matrix.read(d));
      }

      function hideTooltip() {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        d3.select("#tooltip").style("opacity", 0);
        resetChords();
      }

      function resetChords() {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        container.selectAll("path.chord").style("opacity", 0.9);
      }

      function dimChords(d) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        container.selectAll("path.chord").style("opacity", function (p) {
          if (d.source) { // COMPARE CHORD IDS
            return (p._id === d._id) ? 0.9: 0.1;
          } else { // COMPARE GROUP IDS
            return (p.source._id === d._id || p.target._id === d._id) ? 0.9: 0.1;
          }
        });
      }
    }; // END DRAWCHORDS FUNCTION

    this.svg = svg;

    this.resize();
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    let width = this.ref.current.parentElement.clientWidth;
    this.svg.attr({
      width: width,
      height: width / (this.size[0] / this.size[1])
    });
  };

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.markets.length !== this.props.markets.length) {
      this.update();
    }

    if (!compareKeys(prevState.filters, this.state.filters)) {
      this.update();
    }
  }

  update() {
    let {markets} = this.props;
    let {filters} = this.state;

    let data = {};

    for (let market of markets) {
      let [trx, token] = market.pair.split("/");

      if (filters[token] === false) {
        continue;
      }

      if (market.volume < 10000) {
        continue;
      }

      if (!data[market.pair]) {
        data[market.pair] = {
          importer1: trx,
          importer2: token,
          pair: market.pair,
          flow1: 0,
          flow2: 0,
        };
      }

      data[market.pair].flow1 += market.volume;
    }

    this.drawChords(Object.values(data));
  }

  resetFilters = () => {
    this.setState({
      filters: {},
    });
  };

  render() {

    let {filters} = this.state;

    let hasFilters = Object.keys(filters).length !== 0;

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center">{tu("Trade Volume")}</h5>
          <div className="volume-chords" ref={this.ref}/>
          {
            hasFilters &&
              <p className="text-center">
                <button className="btn btn-primary" onClick={this.resetFilters}>Reset Filters</button>
              </p>
          }
        </div>
      </div>
    )
  }
}
