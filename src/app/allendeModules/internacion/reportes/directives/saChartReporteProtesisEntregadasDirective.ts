/**
 * @author:			Ezequiel Mansilla
 * @description:	Grafico para reporte de protesis (entregadas)
 * @type:			Directive
 **/
import * as angular from 'angular';
import chartTemplate = require('../templates/sa-chart-reporte-protesis.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saChartReporteProtesisEntregadas', saChartReporteProtesisEntregadas);

		saChartReporteProtesisEntregadas.$inject = ['$log'];
		function saChartReporteProtesisEntregadas ($log) {
			return {
				restrict : 'E',
				scope : {
					data : '='
				},
				template: chartTemplate,
				link: function (scope) {

					var itemReporte = {
						totalEntregadas : 0,
						totalNoEntregadas : 0
					};

					angular.forEach(scope.data, function(value) {
						itemReporte.totalEntregadas += value.CantidadProtesisEntregadas;
						itemReporte.totalNoEntregadas += value.CantidadProtesisNoEntregadas;
					});

					scope.reporte  = {
						title : 'Prótesis entregadas/no entregadas',
						data : [{
							name: "Entregadas",
							y: itemReporte.totalEntregadas
						}, {
							name: "No Entregadas",
							y: itemReporte.totalNoEntregadas
						}]
					};					
				}
			};
		}
	};

	return module;

})();