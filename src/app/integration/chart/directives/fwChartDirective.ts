/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para graficos
 * @type:			Directive
 **/

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwChart', fwChart);

		fwChart.$inject = ['$log', 'Highcharts'];
		function fwChart ($log, Highcharts) {
			return {
				restrict: 'E',
				template: '<div></div>',
				scope: {
					options: '='
				},
				link: function (scope, element) {
					Highcharts.chart(element[0], scope.options);
				}
			};
		}
	};

	return module;
})();