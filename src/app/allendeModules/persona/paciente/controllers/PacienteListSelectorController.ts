/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('PacienteListSelectorController', PacienteListSelectorController);

		// Inyección de Dependencia
		PacienteListSelectorController.$inject = ['Logger', '$filter', '$q', '$uibModalInstance',
			'PacienteDataService','TITLE_PACIENTE', 'User'];

		// Constructor del Controller
		function PacienteListSelectorController ($log, $filter, $q, $uibModalInstance,
			PacienteDataService,TITLE_PACIENTE, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteListSelectorController');
			$log.debug('ON.-');

				/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;
				vm.title = {
					module: TITLE_PACIENTE.MODULE,
					page: TITLE_PACIENTE.PACIENTE_SELECTOR
				};

				vm.formData = {
					pacienteSeleccionado : null
				};

				vm.data = {
					pacientes: [],
					tiposDocumento : []
				};

				vm.filter = {
					tipoDocumento: '',
					pacientes : [],
					nombrePaciente : '',
					numeroDocumento: '',
					mayorEdad : '',
					clean : cleanFilters,
					cleanDni : cleanFiltersDni,
					cleanNombre : cleanFiltersNombre
				};

				vm.formControl = {
					loading : false,
					ok: returnPaciente,
					cancel : cancel,
					seleccionar : seleccioanrPaciente,
					reloadPage : activate,
					validarForm : validarForm,
					buscarPaciente : buscarPacientesPorDocumentoPorNombre
				};

				vm.paginacion = {
					currentPage : 1,
 					pageSize : 5,
 					totalItems : 0,
 					pageChanged  : getPage,
 					getPage : getPage
				};

				/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

 				/* FORMULARIO */

 				function validarForm () {
 					// var _flag = false;


 					// return _flag;
 				}

 				function cancel () {
 					$uibModalInstance.dismiss('close');
 				}

 				function returnPaciente (pPaciente) {
 					var paciente = pPaciente || vm.formData.pacienteSeleccionado;
 					PacienteDataService.getOnePacienteByClave(paciente.id_paciente)
 					.then(function (pPaciente) {
 						$uibModalInstance.close(pPaciente);
 					});
 				}

 				function buscarPacientesPorDocumentoPorNombre (){
 					vm.formControl.loading = true;

 					if (vm.filter.nombrePaciente)
						buscarPacientesPorNombre();
					else
						buscarPacienteByDocumento();
 				}

 				function buscarPacienteByDocumento () {
 					$log.debug('Buscar por Doc ON.-');
 					var _idTipoDoc;
 					if (vm.filter.tipoDocumento)
 						_idTipoDoc = vm.filter.tipoDocumento.id_tipo_documento;
 					else
 						_idTipoDoc = 0;

 					PacienteDataService.getAllPacienteByDocumento(_idTipoDoc, vm.filter.numeroDocumento)
 					.then(buscarPacientesOk, buscarPacientesError);
 				}
 				
 				function buscarPacientesPorNombre () {
 					$log.debug('Buscar por nombre ON.-');
 					vm.data.pacientes = [];
 					PacienteDataService.getOnePacienteByNombre(vm.filter.nombrePaciente)
 					.then(buscarPacientesOk, buscarPacientesError);
 				}

 				function buscarPacientesOk (pPacientes) {
 					$log.debug('BuscarPacientes OK.-', pPacientes);
 					vm.data.pacientes = pPacientes;
 					for (var i = 0; i < pPacientes.length; i++) {
 						if (pPacientes[i].edad > 18) {
 							pPacientes[i].mayorEdad = true;
 						} else {
 							pPacientes[i].mayorEdad = false;
 						}
 					}
 					vm.formControl.loading = false;
 					getPage();
 				}

 				function buscarPacientesError (pError) {
 					$log.error('Busqueda de paciente error', pError);
 					vm.formControl.loading = false;
 				}

 				function seleccioanrPaciente(pPaciente) {
 					vm.formData.pacienteSeleccionado = pPaciente;
 				}


 				/* PAGINACIÓN */

 				function cleanFilters () {
					// vm.filter.nombrePaciente= '';
					getPage();
 				}

 				function cleanFiltersNombre () {
					vm.filter.nombrePaciente= '';
 				}

 				function cleanFiltersDni () {
					vm.filter.tipoDocumento = '';
					vm.filter.numeroDocumento = '';
 				}

 				function validarFilters () {
 					if (vm.filter.nombrePaciente == null)
 						vm.filter.nombrePaciente = '';
 					if (vm.filter.tipoDocumento == null)
 						vm.filter.tipoDocumento = '';
 					if (!vm.filter.mayorEdad)
 						vm.filter.mayorEdad = '';
 				}

 				function getPage () {
					var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					validarFilters();
					vm.filter.pacientes = $filter('filter')
						(vm.data.pacientes,{
							mayorEdad : vm.filter.mayorEdad
						});
					vm.paginacion.totalItems = vm.filter.pacientes.length;
					vm.filter.pacientes = vm.filter.pacientes.slice(begin, end);
					// $log.debug('GetPage OK.-');
 				}

 				/* OTROS */

 				function inicializarVariables () {
 					vm.data.pacientes = [];
 				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();
				
				function activate () {
					$log.debug('Inicializar ON.-');
					inicializarVariables();
					$log.debug('Inicializar OK.-');
				}
			}
	};

	return module;

})();