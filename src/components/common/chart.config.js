module.exports = {
  pieChart: {
    color: [
      '#98C8EB',
      '#1A3964',
      '#2A4994',
      '#3665B0',
      '#205097',
      '#3A69C4'
    ],
    title: {
      text: '',
      x: 'center',
      link:'',
      target:'self'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} %"
    },

    series: [
      {
        name: '',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '60%'],
        data: [],
        "label": {
          "normal": {
            "show": true,
            "formatter": "{c}%"
          },
          "emphasis": {
            "show": true
          }
        },
        "labelLine": {
          "normal": {
            "show": true,
            "smooth": false,
            "length": 20,
            "length2": 10
          },
          "emphasis": {
            "show": true
          }
        },
      }
    ]
  },
  lineChart: {
    title: {
      text: '',
      x: 'center',
      link:'',
      target:'self'
    },
    grid: {
      left: '5%',
      right: '7%',
      bottom: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [],
      type: 'line',
     // smooth: true
    }]
  },

  ringPieChart: {
    title: {
      text: '',
      x: 'center'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      x: 'right',
      selected: {
        'Bancor Network': false,
        'Gatecoin': false,
        'BitFlip': false,
        'Braziliex': false,
        'Cobinhood': false,
        'CoinExchange': false,
        'CoinFalcon': false,
        'Cryptomate': false,
        'Gatecoin': false,
        'IDEX': false,
        'LiteBit.eu': false,
        'Stocks.Exchange': false,
        'Tidex': false
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b}: {c} ({d}%)"
    },

    series: [
      {
        name: '',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        center: ['50%', '50%'],
        label: {
          normal: {
            position: 'inner',
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: []
      },
      {
        name: '',
        type: 'pie',
        radius: ['40%', '55%'],
        center: ['50%', '50%'],
        data: []
      }
    ]
  },
  multiLineChart: {
    title: {
      text: '',
      x: 'center'
    },
    legend: {
      type: 'scroll',
      data: []
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
      // position:function(p){   //其中p为当前鼠标的位置
      //   return [p[0] + 10, p[1] - 10];
      //  }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: []
  },
  mapChart: {
    color: ['gold'],
    series: [
      {
        name: '',
        type: 'map',
        roam: true,
        hoverable: false,
        mapType: 'none',
        itemStyle: {
          normal: {
            borderColor: 'rgba(100,149,237,1)',
            borderWidth: 0.5,
            areaStyle: {
              color: '#1b1b1b'
            }
          }
        },
        data: [],
        geoCoord: {}
      },
      {
        name: '',
        type: 'map',
        mapType: 'none',
        data: [],
        markPoint: {
          symbol: 'emptyCircle',
          symbolSize: function (v) {
            return 10 + v / 10
          },
          effect: {
            show: true,
            shadowBlur: 0
          },
          itemStyle: {
            normal: {
              label: {show: false}
            },
            emphasis: {
              label: {position: 'top'}
            }
          },
          data: []
        }
      }
    ]
  },
  barChart: {
    // color: ['#3398DB'],
    title: {
      text: 'Ranking'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },

    grid: {
      left: 150
    },

    xAxis: {
      type: 'value',
      name: '',
      axisLabel: {
        formatter: '{value}'
      }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: []
    },
    series: [

      {
        name: '',
        type: 'bar',
        data: [],
        label: {
          normal: {
            show: true,
            textBorderWidth: 0
          }
        },
        itemStyle: {}

      }
    ]
  },
  overviewChart: {
    title: {
      text: '',
      x: 'center',
      link:'',
      target:'self',
      
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      }
    },

    toolbox: {
      y: -5,
      feature: {
        restore: {
          title: 'restore'
        },
        saveAsImage: {
          show: true,
          title: 'save'
        }
      }
    },
    axisPointer: {
      link: {
        xAxisIndex: 'all'
      }
    },
    dataZoom: [{
      start: 0,
      end: 100,
    },
      {
        type: 'inside'
      }],
    grid: [{
      top: 80,
      left: '5%',
      right: 80,
      containLabel: true
    }],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          onZero: true
        },
        data: []
      }],

    yAxis: [
      {
        name: '',
        nameGap: 20,
        type: 'value'
      }],
    series: [{
      name: '',
      type: 'line',

      markPoint: {
        data: [{
          type: 'max',
          name: 'max'
        }, {
          type: 'min',
          name: 'min'
        }]
      },
      data: []
    }]
  }
};
