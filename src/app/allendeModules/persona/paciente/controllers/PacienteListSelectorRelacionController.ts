/**
 * @author 			emansilla
 * @description 	description
 */
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('PacienteListSelectorRelacionController', PacienteListSelectorRelacionController);

		// Inyección de Dependencia
		PacienteListSelectorRelacionController.$inject = ['Logger', '$filter', '$q', '$uibModalInstance',
			'SupportDataService', 'PacienteDataService','ModalService','TITLE_PACIENTE', 'User','IdPaciente','TipoRelacion'];

		// Constructor del Controller
		function PacienteListSelectorRelacionController ($log, $filter, $q, $uibModalInstance,
			SupportDataService, PacienteDataService, ModalService,TITLE_PACIENTE, User,IdPaciente,TipoRelacion) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteListSelectorRelacionController');
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
					tiposDocumento : [],
					tiposResponsable :[],
					responsableNuevo:[]
				};

				vm.filter = {
					tipoDocumento: '',
					pacientes : [],
					nombrePaciente : '',
					apellidoPaciente :'',
					numeroDocumento: '',
					mayorEdad : true,
					clean : cleanFilters,
					cleanDni : cleanFiltersDni,
					cleanNombre : cleanFiltersNombre,
					tiposResponsable :{},
					currentPage: 1,
					filtroNuevo : {}
				};

				vm.formControl = {
					loading : false,
					ok: returnPaciente,
					cancel : cancel,
					reloadPage : activate,
					validarForm : validarForm,
					validaFiltro : validarFiltrosFormulario,
					buscarPaciente : buscar//buscarPacientesPorDocumentoPorNombre
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
 					 var _flag = false;
 					 //$log.debug('Paciente Responsable :', vm.filter.tiposResponsable);
				 	if(!vm.filter.tiposResponsable || !vm.filter.tiposResponsable.Id)
 					 {
 					 	_flag = true;
 					 	ModalService.info('Debe elegir el Tipo de relación.');
 					 } 					
 					return _flag;
				 }
				 /* FILTROS DEL FORMULARIO */
 				function validarFiltrosFormulario() {
					if(vm.filter.nombrePaciente && vm.filter.apellidoPaciente)
						return true;
					else if(vm.filter.numeroDocumento)
						return true;
					return false;
				}

 				function cancel () {
 					$uibModalInstance.dismiss('close');
 				}

 				function returnPaciente (row) {
 					var _formValido = validarForm();
 					if (_formValido === false)
 					{
						 var _IdPacienteResponsable = row.Id;
						 var _NumeroDocumentoPaciente = row.NumeroDocumento;
						 var _Id_TipoDocumento = row.Id_TipoDocumento;
						 var _PacienteNombre =  row.NombreCompleto;
						 var _TipoDocumentoPacienteNombre = row.TipoDocumento;
						 var _obtenerNUevoBack;
						 if(TipoRelacion == 'ACargo'){
							  _obtenerNUevoBack = PacienteDataService.obtenerNuevoPacienteAcargo(IdPaciente);
							}
						else{
								_obtenerNUevoBack = PacienteDataService.obtenerNuevoPacienteResponsable(IdPaciente);
							}

	 					 _obtenerNUevoBack.then(function(responsableNuevo){
		 					
							if(TipoRelacion == 'ACargo')
							{
								responsableNuevo.IdPacienteRelacionado = _IdPacienteResponsable;
								responsableNuevo.IdTipoDocumentoPacienteRelacionado    = _Id_TipoDocumento;
								responsableNuevo.TipoDocumentoPacienteRelacionadoNombre = _TipoDocumentoPacienteNombre;
								responsableNuevo.NumeroDocumentoPacienteRelacionado	   = _NumeroDocumentoPaciente;
								responsableNuevo.PacienteRelacionadoNombre			   = _PacienteNombre;
							}else{
								responsableNuevo.IdPaciente = _IdPacienteResponsable;
								responsableNuevo.NumeroDocumentoPaciente = _NumeroDocumentoPaciente;
								responsableNuevo.PacienteNombre = _PacienteNombre;		
								responsableNuevo.TipoDocumentoPacienteNombre = _TipoDocumentoPacienteNombre;
							}
							
							//responsableNuevo.IdTipoDocumentoPaciente:0
							responsableNuevo.IdTipoRelacionPaciente  = vm.filter.tiposResponsable.Id;
							responsableNuevo.TipoRelacionPacienteNombre = vm.filter.tiposResponsable.Nombre;

							$uibModalInstance.close(responsableNuevo);
	 					 }, activateError);
					} 
 				}
 				
				function buscar() {
					if(vm.filter.currentPage === 0) vm.filter.currentPage = 1;
					vm.buscarPagina({currentPage: vm.filter.currentPage});
				}

 				vm.buscarPagina = function(pPagination) {

		 			vm.filter.currentPage = pPagination.currentPage;
		 			var currentPage = pPagination.currentPage;
		 			var pageSize = pPagination.pageSize || 10;
					vm.data.pacientes = [];
 					vm.formControl.loading = true;
 					var _idTipoDoc = 0;
 					var  _nroDoc = 0;
 					var nombre = ' ';
					var apellido = ' ';

 					if (vm.filter.tipoDocumento)
 						_idTipoDoc = vm.filter.tipoDocumento.Id;

 					if (vm.filter.numeroDocumento)
 						_nroDoc = vm.filter.numeroDocumento;
 					

					if(vm.filter.nombrePaciente) {
						nombre = vm.filter.nombrePaciente;
					}					

					if(vm.filter.apellidoPaciente ) {
						apellido = vm.filter.apellidoPaciente;
					}					

					//$log.debug('Tipo doc: ', _idTipoDoc, 'Nro doc: ', _nroDoc, 'Nombre: ',nombre,' Apellido :',apellido);
					/// nuevo filtro dto				
					if(TipoRelacion == 'ACargo')  vm.filter.mayorEdad = false;

					vm.filter.filtroNuevo.IdTipodocumento = _idTipoDoc;
					vm.filter.filtroNuevo.NumeroDocumento = _nroDoc;
					vm.filter.filtroNuevo.Nombre = nombre;
					vm.filter.filtroNuevo.Apellido = apellido;
					vm.filter.filtroNuevo.Edad = (vm.filter.mayorEdad) ? 18 : 0;
					vm.filter.filtroNuevo.CurrentPage = currentPage;
					vm.filter.filtroNuevo.PageSize = pageSize;

					PacienteDataService.obtenerPacienteConSimilares(vm.filter.filtroNuevo)
 					.then(buscarPacientesOk, buscarPacientesError); 
	 			};

 				function buscarPacientesPorDocumentoPorNombre (){
 					vm.formControl.loading = true;

 					if (vm.filter.nombrePaciente)
						buscarPacientesPorNombre();
					else
						buscarPacienteByDocumento();
 				}

 				function buscarPacienteByDocumento () {
 					$log.debug('Buscar por Doc ON.-');
 					var _idTipoDoc, _nroDoc;

 					if (vm.filter.tipoDocumento)
 						_idTipoDoc = vm.filter.tipoDocumento.Id;
 					else
 						_idTipoDoc = 0;

					_nroDoc = vm.filter.numeroDocumento;

 					PacienteDataService.obtenerPacientePorDocumento(_idTipoDoc,_nroDoc)
 					.then(buscarPacientesOk, buscarPacientesError);
 				}
 				
 				function buscarPacientesPorNombre () {
 					$log.debug('Buscar por nombre ON.-');
 					vm.data.pacientes = [];
 					vm.formControl.loading = true;
 					var _idTipoDoc = 0;
 					var  _nroDoc = 0;
 					
 					if (vm.filter.tipoDocumento)
 						_idTipoDoc = vm.filter.tipoDocumento.Id;

 					if (vm.filter.numeroDocumento)
 						_nroDoc = vm.filter.numeroDocumento;
 					
					PacienteDataService.obtenerPacienteConSimilares(_idTipoDoc,_nroDoc,vm.filter.nombrePaciente,
																	vm.filter.apellidoPaciente)
 					.then(buscarPacientesOk, buscarPacientesError);
 				}

 				function buscarPacientesOk (pPacientes) {
 					$log.debug('BuscarPacientes OK.-', pPacientes);
 					vm.data.pacientes = pPacientes;
 					vm.formControl.loading = false;
 					//getPage();
 				}

 				function buscarPacientesError (pError) {
 					$log.error('Busqueda de paciente error', pError);
 					vm.formControl.loading = false;
 					// $uibModalInstance.dismiss(pError);
 				}


 				/* PAGINACIÓN */

 				function cleanFilters () {
 					vm.filter.tipoDocumento = '';
					vm.filter.nombrePaciente = '';
					vm.filter.apellidoPaciente = '';
					vm.filter.numeroDocumento = null;
					//vm.filter.mayorEdad = false;
					vm.filter.tiposResponsable ='';
					vm.data.pacientes = [];
					// vm.filter.nombrePaciente= '';
					//getPage();
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
 						vm.filter.mayorEdad = false; 					
 					if (vm.filter.tipoResponsable == null)
 						vm.filter.tipoResponsable = '';
 					vm.data.pacientes = [];
 				}

 				function getPage () {
					var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					validarFilters();
					vm.filter.pacientes = $filter('filter')
						(vm.data.pacientes,{
							MayorDeEdad : vm.filter.mayorEdad
						});
					vm.paginacion.totalItems = vm.filter.pacientes.length;
					vm.filter.pacientes = vm.filter.pacientes.slice(begin, end);
					 //$log.debug('GetPage OK.-',vm.filter);					 
 				}

 				/* OTROS */

 				function inicializarVariables () {
 					vm.data.pacientes = [];
 					PacienteDataService.generarCriterioBusqueda().then(function(pFiltros){
						vm.filter.filtroNuevo = pFiltros;
						//$log.debug('Filtros',vm.filter.filtros);
					});
 				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();
				
				function activate () {
					
					inicializarVariables();
					vm.formControl.loading = true;

					vm.title.page = TipoRelacion == 'ACargo' ? TITLE_PACIENTE.PACIENTE_SELECTOR : TITLE_PACIENTE.PACIENTE_SELECTOR + '. (Mayores de 18 años)';

					var _tipoResponsables = SupportDataService.obtenerTodosTipoResponsable();

					$q.all([_tipoResponsables])
					.then(activateOk, activateError);
				}

				function activateOk (pResults) {
					vm.formControl.loading = false;
					vm.data.tiposResponsable = pResults[0];
					
					// getPage();
					//$log.debug('Inicializar OK.-', pResults);
				}

				function activateError (pError) {
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}
	};

	return module;

})();