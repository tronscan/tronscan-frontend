export default {
  piechart: {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: ""
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: true,
      sourceWidth: 562,
      sourceHeight: 400,
      filename: ""
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
    },
    colors: [
      "#C23631",
      "#E25353",
      "#FAE7E4",
      "#FB7676",
      "#F8A45C",
      "#92E8E2",
      "#8086E9",
      "#F15C80",
      "#2B908F",
      "#E4D354"
    ],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true
        },
        showInLegend: true
      }
    },
    series: [
      {
        name: "",
        colorByPoint: true,
        data: [],
        innerSize: "50%"
      }
    ]
  }
};
