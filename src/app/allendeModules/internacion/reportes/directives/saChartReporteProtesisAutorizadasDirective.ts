/**
 * @author:			Ezequiel Mansilla
 * @description:	Grafico para reporte de protesis (autorizadas)
 * @type:			Directive
 **/
import * as angular from 'angular';
import chartTemplate = require('../templates/sa-chart-reporte-protesis.tpl.html');

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saChartReporteProtesisAutorizadas', saChartReporteProtesisAutorizadas);

		saChartReporteProtesisAutorizadas.$inject = ['$log'];
		function saChartReporteProtesisAutorizadas ($log) {
			return {
				restrict : 'E',
				scope : {
					data : '='
				},
				template: chartTemplate,
				link: function (scope) {

					var itemReporte = {
						totalAutorizadas : 0,
						totalNoAutorizadas : 0
					};

					angular.forEach(scope.data, function(value) {
						itemReporte.totalAutorizadas += value.CantidadProtesisAutorizadas;
						itemReporte.totalNoAutorizadas += value.CantidadProtesisNoAutorizadas;
					});

					scope.reporte  = {
						title : 'Prótesis autorizadas/no autorizadas',
						data : [{
							name: "Autorizadas",
							y: itemReporte.totalAutorizadas
						}, {
							name: "No Autorizadas",
							y: itemReporte.totalNoAutorizadas
						}]
					};
					
				}
			};
		}
	};

	return module;

})();