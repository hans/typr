render_chart: (container, series) ->
	options.series = series
	options.chart.renderTo = container
	chart = new Highcharts.Chart options