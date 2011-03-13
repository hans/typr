(function() {
  ({
    render_chart: function(container, series) {
      var chart;
      options.series = series;
      options.chart.renderTo = container;
      return chart = new Highcharts.Chart(options);
    }
  });
}).call(this);
