/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para grafico de tortas
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwPieChart', fwPieChart);

		fwPieChart.$inject = ['$log', 'Highcharts'];
		function fwPieChart ($log, Highcharts) {
			return {
				restrict: 'E',
				template: '<div></div>',
				scope: {
					title: '@',
					data: '='
				},
				link: function (scope, element) {
					Highcharts.chart(element[0], {
						chart: {
							type: 'pie'
						},
						title: {
							text: scope.title
						},
						plotOptions: {
							pie: {
								allowPointSelect: true,
								cursor: 'pointer',
								dataLabels: {
									enabled: true,
									format: '<b>{point.name}</b>: {point.percentage:.1f} %'
								}
							}
						},
						series: [{
							data: scope.data
						}]
					});
				}
			};
		}
	};

	return module;

})();