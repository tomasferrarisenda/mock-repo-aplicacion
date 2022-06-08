/**
 * @author:			Javi Del Mastro
 * @description:	
 * @type:			Controller
 **/
export default (function () {
    'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TurnosPorGenerarController', TurnosPorGenerarController);

		TurnosPorGenerarController.$inject = [
			'$location', 'Logger', '$q', '$filter',
			'ModalService', 'StateHelperService', 
			'PlantillaDataService',
			"IdPlantilla", 'Title'
		];

		function TurnosPorGenerarController (
			$location,  $log, $q, $filter,
			ModalService, StateHelperService,
			PlantillaDataService,
			IdPlantilla, Title) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TurnosPorGenerarController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				page: Title
			};

			vm.data = {
				idPlantilla: IdPlantilla,
				turnosPorGenerar: {}
			}

			vm.formData = {
			}

			vm.formControl = {
				loading : false,
				error : true,				
				reloadPage : activate,
				volver : volver,
				buscar : buscar,
				exportarAExcel: exportarAExcel,
				exportarAPdf: exportarAPdf
			}

			vm.tableOption = {
				CurrentPage : 1,
				PageSize : 15
			};

			vm.table = {
				sorting: sortingTable,
				getPage : getPage
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			function volver () {
				StateHelperService.goToPrevState();
			}

			function sortingTable(pSorting) {
			}

			/**
			 * Busca por cambio de pagina o tamaño de pagina
			 * @param  {Pagination} pPagination
			 */
			function getPage (pPagination) {
				if (pPagination) {
					vm.tableOption.CurrentPage = pPagination.currentPage || 1;
					vm.tableOption.PageSize = pPagination.pageSize || 15;
				} else {
					vm.tableOption.CurrentPage = 1;
					vm.tableOption.PageSize = 15;
				}
				// Guardo la pagina actual
	 			// vm.filter.currentPage = pPagination.currentPage;
	 			buscar();
	  		}

	  		function buscar() {

				$log.debug('buscando (por paginación)');
				vm.formControl.loading = true;
				var _busqueda;

				var _busqueda;
				_busqueda = PlantillaDataService.ObtenerSemanaDeTurnosPorGenerarParaGrilla(vm.data.idPlantilla,
				 vm.tableOption.CurrentPage, vm.tableOption.PageSize);
								
				$q.all([
						_busqueda
					])
					.then(busquedaOk, busquedaError);


				function busquedaOk(pResults) {
					//vm.data.turnosAfectados = pResults[0];
					vm.data.turnosPorGenerar = pResults[0];

					vm.formControl.loading = false;
					$log.debug('Inicializar OK.-', vm.data.turnosPorGenerar);
				}

				function busquedaError(pError) {

					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
					ModalService.error(pError.message);
				}
			}

			function exportarAExcel() {
				PlantillaDataService.obtenerSemanaDeTurnosPorGenerarExportarExcel(vm.data.idPlantilla);
			}
			
			function exportarAPdf() {
				PlantillaDataService.obtenerSemanaDeTurnosPorGenerarExportarPdf(vm.data.idPlantilla);
			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				$log.debug('vm.data.idPlantilla', vm.data.idPlantilla);

				//_turnosObtenerTurnosPorGenerar(vm.data.idPlantilla);
				var _turnosPorGenerar;
				_turnosPorGenerar = PlantillaDataService.ObtenerSemanaDeTurnosPorGenerarParaGrilla(vm.data.idPlantilla,
				 vm.tableOption.CurrentPage, vm.tableOption.PageSize);
				

				$q.all([_turnosPorGenerar]).then(busquedaOk, busquedaError);
				
				
	 			function busquedaOk (pResults) {	 				
	 				vm.data.turnosPorGenerar = pResults[0];
	 				vm.formControl.loading = false;
	 				vm.formControl.error = false;
	 				$log.debug('Inicializar OK.-', pResults);
	 			}

	 			function busquedaError (pError) {
	 				vm.formControl.loading = false;
	 				vm.formControl.error = true;
	 				$log.error('Inicializar ERROR.-', pError);
	 				ModalService.error(pError.message);
	 			}
			}

			/*
			function ObtenerTurnosPorGenerar(idPlantilla) {
				vm.formControl.loading = true;

				var plantillaToGet = PlantillaDataService.ObtenerSemanaDeTurnosPorGenerarParaGrilla(idPlantilla, vm.tableOption.CurrentPage, vm.tableOption.PageSize)
					.then(function(pResult) {

						$log.debug('ObtenerTurnosPorGenerar: Ok', pResult);
						vm.data.plantilla = pResult;
						setearCalendario();
						vm.formControl.loading = false;


					}, function(pError) {
						vm.formControl.loading = false;
						$log.error('ObtenerTurnosPorGenerar: Error', pError);
					});
			}
			*/

		}
	};

	return module;
})();
