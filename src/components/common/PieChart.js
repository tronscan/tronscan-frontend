import React from 'react'
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

export class PieReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      pieId: 'pie' + id
    }
  }

  initPie(id) {
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    myChart.setOption(config.pieChart);
  }

  componentDidMount() {
    config.pieChart.series[0].data = [
      {name: "TRXSsMSfYgqhFhBzCYNHKD9adJrXpWZigb", value: 999891231.8},
      {name: "TJgmwx9TYaqujmdthJkjaLyWXrwTCmmTan", value: 105000000},
      {name: "TNR1Ayq1yXwbZz582R4HANN7wEMsFxxWzn", value: 98998998.9998},
      {name: "TSfZqHYs7nJhuxDnjsL6bCbUmVWVveS5xr", value: 98998998.999776},
      {name: "TGSw5GPXPAMqarGvuJCGBgKZSxixQUGzTD", value: 98998998.999681},
      {name: "TNDAKmYBHfWiu13oHLvkLqNkgYLLuUV5tW", value: 98998998.999646},
      {name: "TCC5yujH99zLr6TUmMxhYuffXWXa9AXb63", value: 98998998.999645},
      {name: "TKfEeSQxYjNC7PEz5o8DyEWmaW8LqG32uU", value: 98998998.999629},
      {name: "TUZCaacRskEM2zCniffesTeyitq191ikhQ", value: 98998998.999565},
      {name: "TKZMoRa2N55VMWcAA3icfhDAMgfbe1AePQ", value: 98998998.999505},
      {name: "TWEJotc7wUehFrkRwrffc9i6YdpK4cWcJV", value: 98998998.999504},
      {name: "TLmvEKywFQzNzRqbtpVk4NasehgZGLLMUT", value: 98998998.999478},
      {name: "TM99pv5uKFhU2X6Ndmjyva8CLEoMwmB84M", value: 98998998.999466},
      {name: "TY4a9M1bsmKpzb6s4Tdhk8Z7WDjYdAXBbP", value: 98998998.999439},
      {name: "TEC3M3UeDRcRUF8usCwessd22AxfkpyGQf", value: 98998998.999392},
      {name: "TCupo38thT2wDFBvnk7YH2TVGPAe9tT68u", value: 98998998.999371},
      {name: "TRRaJGQbLdAtQkrM3EDu88JhwMnBnQ15hW", value: 98998998.99935},
      {name: "TVEQQAYAznpK1LtjyLyvQMZQKKFJuYohu9", value: 98998998.999344},
      {name: "TCJRcD9C66mz8w2C7nQ3nLnxLBBJVUoPmm", value: 98998998.999315},
      {name: "TFGoP1gbCZD3XTkR44YzEL4Y9Znx9Shv5N", value: 98998998.99928},
      {name: "TL7gANcYyPZywYYtuUk713dwBLm7gMP6B4", value: 98998998.999268},
      {name: "TNWdXb1Vy1CCQLAAWeDkusnw67ktgiFJiM", value: 98998998.999242},
      {name: "TRpDZgQ28Fbg6KviHz8ShesDW3bPf3pA9V", value: 98998998.999213},
      {name: "TJZXiywRHmMDimDGg1PP8sqVGJ5VUvruy6", value: 98998998.999202},
      {name: "TRjcYnUpBvAnHdvHofS5Pk9se9DdZV7G42", value: 98998998.999199}
    ];

    this.initPie(this.state.pieId);
  }

  componentDidUpdate() {
  }

  render() {
    return (
        <div>
          <div id={this.state.pieId} style={this.props.style}></div>
        </div>
    )
  }
}

export default PieReact

