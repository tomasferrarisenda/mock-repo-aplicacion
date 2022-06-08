import { ICieDataService } from "../services/CieDataService";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('CieListController', CieListController);

		// Inyección de Dependencia
		CieListController.$inject = [
			'Logger', '$filter', '$q',
			'CieDataService', 'ModalService', 
			'Title', 'Module'
		];

		// Constructor del Controller
		function CieListController (
			$log, $filter, $q,
			CieDataService: ICieDataService, ModalService,
			Title, Module) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CieListController');
			$log.debug('ON.-');

				/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;
				vm.title = {
					module: Module,
					page: Title
				};

				vm.formData = {
					// Información del formulario
				};

				vm.data = {
					// Información traida desde la BD
					lista: [],
					objeto: {}
				};

				vm.filter = {
					lista : [], // Lista filtrada para paginacion
					nombreCompleto : '',
					clean : cleanFilters,
					validar : validarFilters
				};

				vm.formControl = {
					// Manejo del formulario
					error : true,
					loading : false,
					reloadPage : activate,
					volver : volver,
					validarForm : validarForm,
					llenarForm : llenarForm
				};

				vm.paginacion = {
					currentPage : 0,
 					pageSize : 0,
 					totalItems : 0,
 					pageChanged  : getPage,
 					getPage : getPage
				};

				/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

 				/* FORMULARIO */

 				function volver () {
 					// Ejemplo
 					// $location.url('/Home');
 				}

 				function validarForm () {
 					// body...
 				}

 				function llenarForm () {
 					// body...
 				}

 				/* PAGINACIÓN */

 				function cleanFilters () {
					vm.filter.nombreCompleto= '';
 				}

 				function validarFilters () {
 					if (vm.filter.nombreCompleto == null) {
 						vm.filter.nombreCompleto = '';
 					}
 				}

 				function getPage () {
					var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					vm.filter.validar();
					vm.filter.lista = $filter('filter')
						(vm.data.lista,{
							Paciente:
							{
								NombreCompleto : vm.filter.nombreCompleto
							}
							// Agregar los filters restantes
						});
					vm.paginacion.totalItems = vm.filter.lista.length;
					vm.filter.lista = vm.filter.lista.slice(begin, end);
					//$log.debug('GetPage OK.-');
 				}


 				function inicializarVariables () {
 					// vm.data.* 
 					vm.data.lista = [];
 					vm.data.objeto =  {};
 					// vm.formData.*
 				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();
				
				function activate () {
					$log.debug('Inicializar ON.-');
					inicializarVariables();
					vm.formControl.loading = true;

					activateOk('mock');

					// $q.all([llamadas])
					// .then(activateOk, activateError);
				}

				function activateOk (pResults) {
					vm.formControl.loading = false;
					vm.formControl.error = false;
					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError (pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					ModalService.error(pError.message);
					$log.error('Inicializar ERROR.-', pError);
				}

				
			};
	};

	return module;
})();