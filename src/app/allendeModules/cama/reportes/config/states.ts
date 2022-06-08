/**
 * @author 			emansilla
 * @description 	description
 */
import reporteTemplate = require('../views/cama-reporte-ocupacion.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider', '$urlRouterProvider'];

		function routes ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Cama/Reportes','/Cama/Reportes/Ocupacion');
			$stateProvider.state({
				name : 'cama.reportes',
				url : '/Reportes',
				template : '<ui-view><sa-loading><sa/loading></ui-view>'
			});
			
			EstadosCama.$inject = ['CamaDataService'];
			function EstadosCama (CamaDataService) {
				return CamaDataService.getAllEstadosCama();
			}

			CategoriasHabitacion.$inject = ['CamaDataService'];
			function CategoriasHabitacion (CamaDataService) {
				return CamaDataService.getAllCategoriasHabitacion();
			}

			ReporteOcupacion.$inject = ['ReportesCamaDataService', '$stateParams'];
			function ReporteOcupacion (ReportesCamaDataService, $stateParams) {
				var _params = {
					idSucursal : $stateParams.idSucursal,
					tiposHabitacion : $stateParams.tiposHabitacion
				};
				return ReportesCamaDataService.getReporteOcupacion(_params);
			}

			TiposHabitacionContabiliza.$inject = ['CamaDataService'];
			function TiposHabitacionContabiliza(CamaDataService) {
				return CamaDataService.getAllTiposHabitacionContabiliza();
			}

			$stateProvider.state({
				name : 'cama.reportes.ocupacion',
				url : '/Ocupacion',
				template: reporteTemplate,
				controller: 'ReporteCamaOcupacionController',
				controllerAs: 'vm',
				params : {
					idSucursal : 0,
					tiposHabitacion : []
				},
				data : {
					title : 'Reporte de ocupación de camas',
					icon : 'STATS',
					idPermiso : 178
				},
				resolve : {
					EstadosCama : EstadosCama,
					CategoriasHabitacion : CategoriasHabitacion,
					TiposHabitacionContabiliza: TiposHabitacionContabiliza,
					ReporteOcupacion : ReporteOcupacion
				}
			});
		}
	};

	return module;

})();