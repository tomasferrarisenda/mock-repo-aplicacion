/**
 * @author:			Ezequiel Mansilla
 * @description:	Grafico para reporte de ocupacion de camas
 * @type:			Directive
 **/
import * as angular from 'angular';
import chartTemplate = require('../templates/sa-chart-cama-ocupacion.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saChartCamaOcupacion', saChartCamaOcupacion);

		saChartCamaOcupacion.$inject = ['$log'];
		function saChartCamaOcupacion ($log) {
			return {
				restrict : 'E',
				scope : {
					data : '='
				},
				template: chartTemplate,
				link: function (scope, element, attrs) {

					function convertToChart(pItemReporte) {
						return [{
							name: "Ocupadas",
							y: pItemReporte.CantidadCamasOcupadas
						}, {
							name: "Disponibles",
							y: pItemReporte.CantidadCamasDisponibles,
							sliced: true,
							selected: true
						}, {
							name: "En Limpieza",
							y: pItemReporte.CantidadCamasEnLimpieza
						}, {
							name: "En mantenimiento",
							y: pItemReporte.CantidadCamasEnMantenimiento
						}];
					}

					function initReporteCategorias () {
						scope.reporteCategorias = [];

						angular.forEach(scope.data, function(value){

							scope.reporteCategorias.push({
								title : value.NombreCategoriaHabitacion + ' - Total: ' + value.CantidadCamasTotal,
								data : convertToChart(value)
							});
						});
						$log.debug('reporte categorias', scope.reporteCategorias);
					}

					function initReporteTotal () {
						var total = {
							CantidadCamasTotal : 0,
							CantidadCamasOcupadas : 0,
							CantidadCamasDisponibles : 0,
							CantidadCamasEnLimpieza : 0,
							CantidadCamasEnMantenimiento : 0
						};
						angular.forEach(scope.data, function(value){
							total.CantidadCamasTotal += value.CantidadCamasTotal;
							total.CantidadCamasOcupadas += value.CantidadCamasOcupadas;
							total.CantidadCamasDisponibles += value.CantidadCamasDisponibles;
							total.CantidadCamasEnLimpieza += value.CantidadCamasEnLimpieza;
							total.CantidadCamasEnMantenimiento += value.CantidadCamasEnMantenimiento;
						});

						scope.reporteTotal = {
							title : 'TOTAL - ' + total.CantidadCamasTotal,
							// data : convertToChart(total)
							data : [{
							name: "Ocupadas",
								y: total.CantidadCamasOcupadas
							}, {
								name: "Disponibles",
								y: total.CantidadCamasDisponibles,
								sliced: true,
								selected: true
							}, {
								name: "En Limpieza",
								y: total.CantidadCamasEnLimpieza
							}, {
								name: "En mantenimiento",
								y: total.CantidadCamasEnMantenimiento
							}]
						};

						$log.debug('reporte total', scope.reporteTotal);
					}

					activate();

					function activate () {
						initReporteTotal();
						initReporteCategorias();
						
					}
				}
			};
		}
	};

	return module;

})();