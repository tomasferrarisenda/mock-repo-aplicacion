/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PracticaMedicaSelectorController', PracticaMedicaSelectorController);

		// Inyeccion de dependencia
		PracticaMedicaSelectorController.$inject = ['$filter', 'Logger', '$q', '$uibModalInstance',
		'PracticaMedicaDataService', 'PracticaMedicaLogicService', 'User', 'Type'];
		
		// Constructor del Controller
		function PracticaMedicaSelectorController ($filter, $log, $q, $uibModalInstance,
			PracticaMedicaDataService, PracticaMedicaLogicService, User, Type) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PracticaMedicaSelectorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
				
				var vm = this;

				vm.data = {
					practicasMedicas : [],
					subPracticasMedicas : []
				};

				vm.formData = {
					practicaSeleccionada : ''
				};

				vm.formControl = {
					loading : false,

					getSubPracticas : getSubPracticas,

					validarOk: validarOk,
					cancel : cancel,
					ok: ok,
					seleccionar : seleccionarPractica
				};

				vm.paginacion = {
					currentPage : 0,
					pageSize : 0,
					totalItems : 0,
					pageChanged  : getPage,
					getPage : getPage
				};

				vm.filter = {
					practicasMedicas : [],
					nombrePractica : '',
					codigoPractica: '',
					clean : cleanFilters
				};

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */

				/* FORMULARIO */

				function validarOk () {
					var _flag = false;
					
					if (vm.formData.practicaSeleccionada != null) {
						if (vm.formData.practicaSeleccionada != '') {
							_flag = true;
						}
					} 

					return _flag;
				}

				function ok (pPractica) {
					var practica = pPractica || vm.formData.practicaSeleccionada;
					$uibModalInstance.close(practica);
				}

				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function seleccionarPractica(pPractica) {
					vm.formData.practicaSeleccionada = pPractica;

					if (pPractica.esSubPractica) {
						ok(pPractica);
					} else {
						getSubPracticas(pPractica);
					}
				}

				function getSubPracticas (pPractica) {
					$log.debug('getSubPracticas',pPractica);

					var id = pPractica.id_practica_medica;

					PracticaMedicaDataService.getAllSubPracticasByPractica(id)
					.then(getSubPracticasOk, pSubPracticasError);

					function getSubPracticasOk(pSubPracticas) {
						$log.debug('getSubPracticasOk',pSubPracticas);
						vm.data.subPracticasMedicas = pSubPracticas;
						if (pSubPracticas.length) {
							setEsSubpractica(vm.data.subPracticasMedicas, true);
						} else {
							ok(pPractica);
						}
					}

					function pSubPracticasError(pError) {
						vm.data.subPracticasMedicas = [];
					}
				}

				function setEsSubpractica (pPracticas, pBool) {
					for (var i = 0; i < pPracticas.length; i++) {
						pPracticas[i].esSubPractica = pBool;
					}
				}

				/* PAGINACIÓN */

				function cleanFilters () {
					vm.filter.nombrePractica = '';
					vm.filter.codigoPractica = '';
					vm.formData.practicaSeleccionada = '';
					vm.data.subPracticasMedicas = [];
					getPage();
				}

				function validarFilters () {
					if (vm.filter.nombrePractica == null)
						vm.filter.nombrePractica = '';
					if (vm.filter.codigoPractica == null)
						vm.filter.codigoPractica = '';
				}

				function getPage (pPage?) {

					$log.debug('getpage', pPage);

					var page = pPage || 1;
					var begin = ((page - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					validarFilters();
					vm.filter.practicasMedicas = $filter('filter')
						(vm.data.practicasMedicas,{
						nombre_practica_medica : vm.filter.nombrePractica,
						codigo_practica_medica : vm.filter.codigoPractica
					});
					vm.paginacion.currentPage = page;
					vm.paginacion.totalItems = vm.filter.practicasMedicas.length;
					vm.filter.practicasMedicas = vm.filter.practicasMedicas.slice(begin, end);
				}

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate () {
					vm.formControl.loading = true;
					$log.debug('Inicializar ON.-');

					if (Type) {
						PracticaMedicaDataService.getAllPracticasMedicaByTipo(Type)
						.then(activateOk, activateError);
					} else {
						PracticaMedicaDataService.getAll()
						.then(activateOk, activateError);
					}
				}

				function activateOk (pResults) {
					vm.data.practicasMedicas = pResults;

					setEsSubpractica(vm.data.practicasMedicas, false);

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 5;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError (pError) {
					vm.formControl.loading = false;
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			};
		};

	return module;
})();