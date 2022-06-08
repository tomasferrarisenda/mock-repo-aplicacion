/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import historicoTemplate = require('../views/internacion-historico.html');
import protesisStatsTemplate = require('../views/protesis-stats.html');
import flujoCamasTemplate = require('../views/internacion-flujo-camas.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			
			$urlRouterProvider.when('/Internacion/Reportes', '/Internacion/Reportes/Historico');

			var states = [
				{
					name : 'internacion.reportes',
					url : '/Reportes',
					template : '<ui-view><sa-loading></sa-loading></ui-view>',
					data : {
						module : 'REPORTES',
						path : 'Internacion/Reportes'
					}
				},
				{
					name : 'internacion.reportes.historico',
					url : '/Historico',
					template: historicoTemplate,
					controller: 'InternacionHistoricoController',
					controllerAs: 'vm',
					data : {
						title : 'HISTÓRICO DE INTERNACIONES',
						icon : 'STATS',
						idPermiso : 139
					}
				},
				{
					name : 'internacion.reportes.protesis',
					url : '/Protesis/{fechaRecepcionProbable}',
					template: protesisStatsTemplate,
					controller: 'ProtesisReporteTotalController',
					controllerAs: 'vm',
					// params : {
					// 	fechaRecepcionProbable : null
					// },
					data : {
						title : 'PRÓTESIS',
						icon : 'STATS',
						idPermiso : 189
					},
					resolve : {
						Reporte : ReporteProtesis,
						CantidadPacientes : CantidadPacientesConProtesis
					}
				},
				{
					name : 'internacion.reportes.flujoCamas',
					url : '/FlujoCamas/{fechaAdmisionProbable}',
					template: flujoCamasTemplate,
					controller: 'InternacionFlujoCamasController',
					controllerAs: 'vm',
					data : {
						title : 'FLUJO DE CAMAS',
						icon : 'STATS',
						idPermiso : 190
					},
					resolve : {
						Reporte : ReporteFlujoCamas
					}
				}
			];

			ReporteProtesis.$inject = ['InternacionReportesDataService', '$stateParams'];
			function ReporteProtesis(InternacionReportesDataService, $stateParams) {
				return InternacionReportesDataService.getReporteProtesis($stateParams.fechaRecepcionProbable);
			}

			CantidadPacientesConProtesis.$inject = ['InternacionReportesDataService', '$stateParams'];
			function CantidadPacientesConProtesis(InternacionReportesDataService, $stateParams) {
				return InternacionReportesDataService
					.getCantidadPacienteByFechaProbableRecepcionMateriales($stateParams.fechaRecepcionProbable);
			}

			ReporteFlujoCamas.$inject = ['InternacionReportesDataService', '$stateParams'];
			function ReporteFlujoCamas (InternacionReportesDataService, $stateParams) {
				if ($stateParams.fechaAdmisionProbable)
					return InternacionReportesDataService.getReporteFlujoCamas($stateParams.fechaAdmisionProbable);
				else 
					return;
			}

			angular.forEach(states, function(state){
				$stateProvider.state(state);
			});

		}
	};

	return module;

})();