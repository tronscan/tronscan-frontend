module.exports = {
  pieChart: {
    tooltip: {
      trigger: 'item',
      formatter: "{b}<br> {c} ({d}%)"
    },

    series: [
      {
        name: '',
        type: 'pie',
        radius: '55%',
        center: ['50%', '55%'],
        data: [],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  },
  lineChart: {
    grid: {
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [],
      type: 'line',
      smooth: true
    }]
  },

  ringPieChart: {

    legend: {
      orient: 'vertical',
      x: 'right',
      selected:{'Bancor Network':false,'Gatecoin':false}
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
        center:['50%','50%'],
        label: {
          normal: {
            position: 'inner'
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
        center:['50%','50%'],
        data: []
      }
    ]
  }
};
