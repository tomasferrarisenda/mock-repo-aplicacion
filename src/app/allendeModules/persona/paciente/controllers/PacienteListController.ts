/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PacienteListController', PacienteListController);

		// Inyección de Dependencia
		PacienteListController.$inject = ['Logger', '$filter', '$state', '$q', 'PacienteDataService', 'PacienteStorageHelperService',
		'PacienteAuthService','ModalService', 'User'];

		// Constructor del Controller
		function PacienteListController ($log, $filter, $state, $q, PacienteDataService, PacienteStorageHelperService,
			PacienteAuthService, ModalService: IModalService, User ) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteListController');
			$log.debug('ON.-');
				
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;

				vm.title = {
					name: $state.current.data.title,
					icon: $state.current.data.icon
				};

				vm.formData = {
					// Información del formulario
					nombreEstadoEmpadronamiento:''
				};

				vm.data = {
					// Información traida desde la BD
					tiposDocumento : [],
					pacientes : [],
					estadosEmpadronamientos :[]
				};

				vm.storage = {
					keyPacienteEditStorage: "paciente-edit-storage"
				};

				vm.filter = {
					nombrePaciente : '',
					apellidoPaciente :'',
					tipoDocumento : '',
					numeroDocumento : null,
					clean: cleanFilters,
					validar: validarFilters,
					currentPage: 1,
					filtroNuevo : {},
					pacientes : []
				};

				vm.formControl = {
					// Manejo del formulario
					error: true,
					loading: false,
					reloadPage: activate,
					valid : validarFormulario,
					volver: volver,
					search : buscar,//buscarPacientesPorDocumentoPorNombre,//buscarPacientesPorNombre,
					searchSP:buscarSinPaginacion,
					openPaciente : openPaciente,
					newPaciente : newPaciente,					
					obtenerColorEstadoEmpadronamiento : obtenerColorEstadoEmpadronamiento,
					obtenerNombreEstadoEmpadronamiento : obtenerNombreEstadoEmpadronamiento
				};

				vm.paginacion = {
					currentPage: 1,
 					pageSize: 10,
 					totalItems: 0,
 					pageChanged : getPage,
 					getPage: getPage
				};

				vm.validar = {
						puedeVer: validarPuedeVer,
						puedeAgregar: validarPuedeAgregar,
						puedeEditar: validarPuedeEditar,
						puedeEliminar: validarPuedeEliminar
				};

 			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

 				/* FORMULARIO */
 				function validarFormulario() {
 					if(vm.filter.nombrePaciente && vm.filter.apellidoPaciente)
 						return true;
 					else if(vm.filter.numeroDocumento)
 						return true;
 					return false;
 				}

 				function obtenerColorEstadoEmpadronamiento(pIdEstado){
 					var colorClase = '';
 					vm.formData.nombreEstadoEmpadronamiento =''; 					
					for (var i = 0; i < vm.data.estadosEmpadronamientos.length; i++) {
						if (vm.data.estadosEmpadronamientos[i].Id === pIdEstado){
							colorClase = vm.data.estadosEmpadronamientos[i].Color;
							vm.formData.nombreEstadoEmpadronamiento = vm.data.estadosEmpadronamientos[i].Nombre;
							break;
						}
					}
					return colorClase;
 				}
 				
 				function obtenerNombreEstadoEmpadronamiento(pIdEstado){
 					var nombreEstado = ''; 					
					for (var i = 0; i < vm.data.estadosEmpadronamientos.length; i++) {
						if (vm.data.estadosEmpadronamientos[i].Id === pIdEstado){
							nombreEstado = vm.data.estadosEmpadronamientos[i].Nombre;
							break;
						}
					}
					return nombreEstado;
 				}

 				function volver () {
 					// Ejemplo
 					// $location.url('/Home');
 				}

 				function llenarForm () {
 					// body...
 				}

 				/* PAGINACIÓN */

 				function cleanFilters () {

					vm.filter.tipoDocumento = '';
					vm.filter.nombrePaciente = '';
					vm.filter.apellidoPaciente = '';
					vm.filter.numeroDocumento = null;
					vm.data.pacientes = [];
					//getPage();	
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
					vm.filter.pacientes = $filter('filter')
						(vm.data.pacientes,{
							//NombreCompleto : vm.filter.apellidoPaciente + vm.filter.nombrePaciente
							// Agregar los filters restantes
						});
					vm.paginacion.totalItems = vm.filter.pacientes.length;
					vm.filter.pacientes = vm.filter.pacientes.slice(begin, end);
					$log.debug('GetPage OK.-');
 				}


 				function inicializarVariables () {
 					vm.data.pacientes = [];
 					cleanFilters();
 					PacienteDataService.generarCriterioBusqueda().then(function(pFiltros){
						vm.filter.filtroNuevo = pFiltros;
						$log.debug('Filtros',vm.filter.filtroNuevo);
					});
				 }
				 
				function buscarSinPaginacion() {
					var isValid = validarFormulario();
					if (isValid || PacienteStorageHelperService.existStoredObjects(vm.storage.keyPacienteEditStorage)) {

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
	
	
					   if(vm.filter.nombrePaciente !== null && vm.filter.nombrePaciente !== '' &&
							!angular.isUndefined(vm.filter.nombrePaciente)) {
						   nombre = vm.filter.nombrePaciente;
					   }
	
					   if(nombre === null || nombre === '' || angular.isUndefined(nombre)) {
						   nombre = ' ';
					   }
	
					   if(vm.filter.apellidoPaciente !== null && vm.filter.apellidoPaciente !== '' &&
							!angular.isUndefined(vm.filter.apellidoPaciente)) {
						   apellido = vm.filter.apellidoPaciente;
					   }
	
					   if(apellido === null || apellido === '' || angular.isUndefined(apellido)) {
						   apellido = ' ';
					   }
	
					   //$log.debug('Tipo doc: ', _idTipoDoc, 'Nro doc: ', _nroDoc, 'Nombre: ',nombre,' Apellido :',apellido);
					   /// nuevo filtro dto
					   vm.filter.filtroNuevo.IdTipodocumento = _idTipoDoc;
					   vm.filter.filtroNuevo.NumeroDocumento = _nroDoc;
					   vm.filter.filtroNuevo.Nombre = nombre;
					   vm.filter.filtroNuevo.Apellido = apellido;
					   vm.filter.filtroNuevo.IdPacienteBusca = 0;
					   if (PacienteStorageHelperService.existStoredObjects(vm.storage.keyPacienteEditStorage)) {
						 vm.filter.filtroNuevo.IdPacienteBusca = PacienteStorageHelperService.getStorageObj(vm.storage.keyPacienteEditStorage);
					   }
					   //vm.filter.filtroNuevo.Edad
					   vm.filter.filtroNuevo.CurrentPage = 1;
					   vm.filter.filtroNuevo.PageSize = 10;
					   ///
					   PacienteDataService.obtenerPacienteConSimilares(vm.filter.filtroNuevo)
						.then(buscarPacientesOk, buscarPacientesError); 
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

					if(vm.filter.nombrePaciente !== null && vm.filter.nombrePaciente !== '' &&
						 !angular.isUndefined(vm.filter.nombrePaciente)) {
						nombre = vm.filter.nombrePaciente;
					}

					if(nombre === null || nombre === '' || angular.isUndefined(nombre)) {
						nombre = ' ';
					}

					if(vm.filter.apellidoPaciente !== null && vm.filter.apellidoPaciente !== '' &&
						 !angular.isUndefined(vm.filter.apellidoPaciente)) {
						apellido = vm.filter.apellidoPaciente;
					}

					if(apellido === null || apellido === '' || angular.isUndefined(apellido)) {
						apellido = ' ';
					}

					//$log.debug('Tipo doc: ', _idTipoDoc, 'Nro doc: ', _nroDoc, 'Nombre: ',nombre,' Apellido :',apellido);
					/// nuevo filtro dto				
					vm.filter.filtroNuevo.IdTipodocumento = _idTipoDoc;
					vm.filter.filtroNuevo.NumeroDocumento = _nroDoc;
					vm.filter.filtroNuevo.Nombre = nombre;
					vm.filter.filtroNuevo.Apellido = apellido;
					//vm.filter.filtroNuevo.Edad
					vm.filter.filtroNuevo.CurrentPage = currentPage;
					vm.filter.filtroNuevo.PageSize = pageSize;
					vm.filter.filtroNuevo.PaginacionPorBack = true;
					/// 
					//PacienteDataService.obtenerPacienteConSimilares(_idTipoDoc,_nroDoc,nombre,apellido,currentPage,pageSize)
					PacienteDataService.obtenerPacienteConSimilares(vm.filter.filtroNuevo)
 					.then(buscarPacientesOk, buscarPacientesError); 
	 			};

				function buscarPacientesPorDocumentoPorNombre (){

 					if ((vm.filter.nombrePaciente) && (vm.filter.apellidoPaciente)){
						buscarPacientesPorNombre();
					}
					else{
						buscarPacientePorDocumento ();
					}
 				}

 				//usa ado copia jorge 
 				function buscarPacientePorDocumento () {
 					var _idTipoDoc, _nroDoc;
 					
 					if (vm.filter.tipoDocumento)
 						_idTipoDoc = vm.filter.tipoDocumento.Id;
 					else
 						_idTipoDoc = 0;

 					_nroDoc = vm.filter.numeroDocumento;
 					 //$log.debug('Tipo doc: ', _idTipoDoc, 'Nro doc: ', _nroDoc);
 					 vm.formControl.loading = true;
 					PacienteDataService.obtenerPacientePorDocumento(_idTipoDoc, _nroDoc)
 					.then(buscarPacientesOk, buscarPacientesError);
 				}
 				
 				function buscarPacientesOk (pPacientes) {
 					$log.debug('PacienteListSelectorController: BuscarPacientes OK.-', pPacientes);
 					vm.data.pacientes = pPacientes;
 					vm.formControl.loading = false;
 					//getPage();
 				}

 				function buscarPacientesError (pError) {
 					$log.error('Busqueda de paciente error', pError);
 					vm.formControl.loading = false;
 					ModalService.error(pError.message);
 				}

 				function buscarPacientesPorNombre () {

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

 				function openPaciente (row) {
 					PacienteDataService.idPaciente = row.Id;
					 $log.debug('ID PACIENTE', row.Id);
					 

					//vamos a guardar los datos buscados
					setStoredData(row);

						//MODULO DESACTIVADO
					// $state.go('paciente.edit', { 
					// 			idPaciente: row.Id
					// 		});
 					// $location.url('/Paciente/Edit');
 				}

 				function newPaciente () {

 					$state.go('paciente.new');
 					// $location.url('/Paciente/New');
 				}

 					/* VALIDACION */

				function validarPuedeVer() {
					return PacienteAuthService.puedeVerPaciente(User);
				}				
				function validarPuedeAgregar() {
					return PacienteAuthService.puedeAgregarPaciente(User);
				}				
				function validarPuedeEditar() {
					return PacienteAuthService.puedeEditarPaciente(User);
				}				
				function validarPuedeEliminar() {
					return PacienteAuthService.puedeEliminarPaciente(User);
				}					

 			/* -------------------------------------------- ACTIVATE -------------------------------------------- */
 				activate();
				/* Método inicializador */
				function activate () {
					$log.debug('Inicializar ON.-');
					inicializarVariables();					
					PacienteDataService.idPaciente = 0;

					getStoredData();
				

					var _empadronamientos = PacienteDataService.obtenerTodosEstadoEmpadronamiento()
					.then(function (pResults) {
						
						if(pResults)
						vm.data.estadosEmpadronamientos = pResults;

					}, function (pError) {
						$log.error('Busqueda de estadosEmpadronamientos', pError);
					});


				}


				/* ---------------------------------------------- STORAGE ---------------------------------------------- */


			function getStoredData() {

				if (PacienteStorageHelperService.existStoredObjects(vm.storage.keyPacienteEditStorage)) {

					var _idPaciente = getData(PacienteStorageHelperService.getStorageObj(vm.storage.keyPacienteEditStorage));
					$log.debug('Existe id pciente',_idPaciente);

					buscarSinPaginacion();
					cleanStorage();

				}

				function getData(stored) {

					return stored;
				}
			}

			function cleanStorage() {

				$log.debug('cleanStorage');
				PacienteStorageHelperService.cleanStorage(vm.storage.keyPacienteEditStorage);

			}

			function setStoredData(paciente) {

				var pacienteIdStorage = angular.copy(paciente.Id);
				PacienteStorageHelperService.setStorageObj(vm.storage.keyPacienteEditStorage, pacienteIdStorage);

			}
				
			}
	};

	return module;

})();