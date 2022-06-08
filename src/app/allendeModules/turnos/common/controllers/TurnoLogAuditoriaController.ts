/**
 * @author:			Javi Delmastro
 * @description:	
 * @type:			Controller
 **/


export default (function () {
    'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TurnoLogAuditoriaController', TurnoLogAuditoriaController);

		TurnoLogAuditoriaController.$inject = [
			'$location', 'Logger', '$q', '$filter',
			'ModalService', 'StateHelperService', 
			'TurnoDataService',
			"IdTurno", 'Title'
		];

		function TurnoLogAuditoriaController (
			$location,  $log, $q, $filter,
			ModalService, StateHelperService,
			TurnoDataService,
			IdTurno, Title) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TurnoLogAuditoriaController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				page: Title
			};

			vm.data = {
				idTurno: IdTurno,
				cambiosDeEstados: {}
			}

			vm.formData = {
			}

			vm.formControl = {
				loading : false,
				error : true,				
				reloadPage : activate,
				save : methodSave,
				volver : volver,
				buscar : buscar
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



			function inicializarVariables () {
			}
			
			function llenarForm () {
			}

			function methodSave () {
			}

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
				_busqueda = TurnoDataService.obtenerConLogAuditoriaPorId(vm.data.idTurno,
				 vm.tableOption.CurrentPage, vm.tableOption.PageSize);
								
				$q.all([
						_busqueda
					])
					.then(busquedaOk, busquedaError);


				function busquedaOk(pResults) {					
					vm.data.cambiosDeEstados = pResults[0];
					vm.formControl.loading = false;
					$log.debug('Inicializar OK.-', vm.data.cambiosDeEstados);
				}

				function busquedaError(pError) {
					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
					ModalService.error(pError.message);
				}
			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				$log.debug('vm.data.idTurno', vm.data.idTurno);

				var _cambiosDeEstados;
				_cambiosDeEstados = TurnoDataService.obtenerConLogAuditoriaPorId(vm.data.idTurno,
				 vm.tableOption.CurrentPage, vm.tableOption.PageSize);
				

				$q.all([_cambiosDeEstados]).then(busquedaOk, busquedaError);
				
				
	 			function busquedaOk (pResults) {	 				
	 				vm.data.cambiosDeEstados = pResults[0];
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

		}
	};

	return module;
})();
