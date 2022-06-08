/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PacienteNewController', PacienteNewController);

		PacienteNewController.$inject = ['$scope', 'Logger', '$q','$stateParams', '$state',
			'PacienteLogicService', 'PacienteDataService', 'ModalService','MutualLogicService',
			 'User','PacienteAuthService','StateHelperService','DateUtils','SelectorService', 'Resolves'];

		function PacienteNewController ($scope, $log,$q, $stateParams, $state,
			PacienteLogicService, PacienteDataService, ModalService, MutualLogicService,
			User,PacienteAuthService,StateHelperService,DateUtils,SelectorService, Resolves) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;
			vm.tabs = [];
			vm.title = {
				page: $state.current.data.title,
				icon: $state.current.data.icon
			};

			vm.formData = {

			};

			vm.data = {
				paciente : {},
				estadosCivil : [],
				tiposDocumentos : [],
				nacionalidades : [],
				estadosPacired : [],
				tiposSexo : [],
				nacionalidadPaciente: [],
				tiposRelacionPaciente : [],
				pacienteTitle: '',
				tiposPaciente : []
			};

			vm.formControl = {
				error: true,
				loading: false,
				reload: activate,
				updateFechaNacimiento : updateFechaNacimiento,
				// validarForm : validarForm,
				crear : addPaciente,
				cancel : cancel,
				validarPacientePorDocumento : validarExistenciaPacientePorDocumento,
				validarPacientePorNombre : validarExistenciaPacientePorNombre,
				pacienteValidado : false,
				permisoEditarEstadoEmpadronamiento : false,
				permisoEditarTipoPaciente : false,
				deshabilitaEditarNombreDocumento : false,
				numeroDocumentoRequerido : true,
				NumeroDocumentoHabilitado : true,
				TipoDocumentoHabilitado : false,
				btnAgregaApellidoDesahabilitado : true,
				validaNumeroDocumentoHabilitado : validaNumeroDocumentoHabilitado,
				validaNumeroDocumentoRequerido :validaNumeroDocumentoRequerido,
				visualizaEstadosPaciente : visualizaEstadosPaciente,
				visualizaTiposPaciente : visualizaTiposPaciente,
				today : new Date(),
				tipoDocumentoSelectDefault : true,
				puedeEditarInformeWeb : false,
				disabledSave: disabledSave,
				saveDisabled: false
			};

			vm.filter = {	
					currentPage: 1,
					pageSize : 10,
					filtroNuevo : {},
					numeroDocumentoAnterior : 0,
					apellidoAnterior : "",
					nombreAnterior :""
				};

			vm.externo = {
				externo : false,
				idTipoDocumento : 0,
				numeroDocumento :0
			}	

			vm.responsable = {
				open : newResponsable,
				delete : deleteResponsable,
				changeDefecto : cambiarResponsablePorDefecto
			};
			vm.pacientesAmiCargo = {
				open : newPacienteAcargo,
				delete : deletePacienteAcargo
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function inicializarVariables () {
				// Inicializar data y formData.
				 PacienteDataService.generarCriterioBusqueda().then(function(pFiltros){
						vm.filter.filtroNuevo = pFiltros;
						//$log.debug('Filtros',vm.filter.filtros);
					});
			}

			function initForm () {				
				vm.tabs = PacienteAuthService.getTabs($state.current.data.idPermiso, User);	
				vm.formControl.permisoEditarTipoPaciente = vm.data.paciente.PuedeEditarTipoDePaciente;
				vm.formControl.permisoEditarEstadoEmpadronamiento = vm.data.paciente.PuedeEditarEstadoEmpadronamiento;
				if(!vm.data.paciente.TipoDocumentoPacienteBase){
					vm.data.paciente.TipoDocumentoPacienteBase = {}
				}
				if(vm.formControl.puedeFusinarPaciente || vm.data.paciente.PuedeEditarInformeWeb)
					vm.formControl.puedeEditarInformeWeb = true;
				vm.data.paciente.TipoDocumentoPacienteBase = angular.copy(vm.data.paciente.TipoDocumentoPaciente);
				validaNumeroDocumentoRequerido();
				validaTipoDocumentoHabilitado();
				//$log.debug('vm.tabs ', vm.tabs);
			}

			function cancel (pPristine) {
				PacienteLogicService.cancelar(pPristine);
				//$state.go('paciente.list');				
			}

			function validarExistenciaPacientePorDocumento (pDirty) {
				if(pDirty && $.trim(vm.filter.numeroDocumentoAnterior) !== $.trim(vm.data.paciente.NumeroDocumento)){
					vm.formControl.validationLoading = true;
					PacienteLogicService.validarExistenciaPacientePorDocumento(vm.data.paciente,vm.filter.filtroNuevo,
																	vm.filter.currentPage,vm.filter.pageSize)
					.then(function () {
						vm.formControl.validationLoading = false;
						vm.filter.numeroDocumentoAnterior= $.trim(vm.data.paciente.NumeroDocumento);
					}, function () {
							vm.formControl.validationLoading = false;
							vm.filter.numeroDocumentoAnterior= $.trim(vm.data.paciente.NumeroDocumento);
					});
				}
			}

			function validarExistenciaPacientePorNombre (pDirty) {
				if(pDirty && ($.trim(vm.filter.nombreAnterior) !== $.trim(vm.data.paciente.Nombre) || $.trim(vm.filter.apellidoAnterior) !== $.trim(vm.data.paciente.Apellido)))
				{	
					vm.formControl.validationLoading = true;
					PacienteLogicService.validarExistenciaPacientePorNombre(vm.data.paciente,vm.filter.filtroNuevo,
																vm.filter.currentPage,vm.filter.pageSize)
					.then(function () {
						vm.formControl.validationLoading = false;
						vm.filter.nombreAnterior= $.trim(vm.data.paciente.Nombre);
						vm.filter.apellidoAnterior= $.trim(vm.data.paciente.Apellido);
						}, function () {
							vm.formControl.validationLoading = false;
							vm.filter.nombreAnterior= $.trim(vm.data.paciente.Nombre);
							vm.filter.apellidoAnterior= $.trim(vm.data.paciente.Apellido);
						});
				}	
			}

			function disabledSave(){
				vm.formControl.saveDisabled = true;
				setTimeout(() => {
					vm.formControl.saveDisabled = false;
					}, 1000);
			}
			function addPaciente (form) {
				if (form.$valid) {
					if(!PacienteLogicService.validarTipoDeDocumentoElegible(vm.data.paciente)){
						ModalService.info('El tipo de Documento elegido no es valido.');
					}
					else{
						PacienteLogicService.confirmarCreacionPaciente('',vm.data.paciente);
					}
					
				} else {
					form.$setSubmitted();
					// form.formTabGeneral.$setSubmitted();
					// form.formTabMutuales.$setSubmitted();
				}
			}			

			function validaNumeroDocumentoRequerido() {
				vm.formControl.numeroDocumentoRequerido = PacienteLogicService.esNumeroDocumentoRequerido(vm.data.paciente);
				validaNumeroDocumentoHabilitado();
			}

			function validaNumeroDocumentoHabilitado() {
				vm.formControl.NumeroDocumentoHabilitado = PacienteLogicService.esNumeroDocumentoDeshabilitado(vm.data.paciente);
			}

			function validaTipoDocumentoHabilitado() {
				vm.formControl.TipoDocumentoHabilitado = PacienteLogicService.esTipoDocumentoDeshabilitado(vm.data.paciente);
			}

			function visualizaEstadosPaciente() {				
				return PacienteLogicService.validarVisualizaEstadosPaciente(vm.data.paciente);
			}

			function visualizaTiposPaciente() {
				return PacienteLogicService.validarVisualizaTiposPaciente(vm.data.paciente);
			}
			/* ------------------------------ RESPONSABLE ------------------------------ */

			function newResponsable () {
				PacienteLogicService.nuevoResponsable(User, vm.data.paciente, $scope);
			}

			function deleteResponsable(pIndex) {
				PacienteLogicService.borrarResponsable(vm.data.paciente.PacientesResponsables, pIndex,$scope)
			}

			function cambiarResponsablePorDefecto (pResponsable) {
				PacienteLogicService.changeResponsableDefecto(pResponsable, vm.data.paciente.PacientesResponsables,$scope);
			}
			/* --------------------------------- PACIENTES A CARGO -------------------------*/
						
			function newPacienteAcargo () {
				PacienteLogicService.nuevoAcargo(User, vm.data.paciente, $scope);
			}

			function deletePacienteAcargo(pIndex) {
				PacienteLogicService.borrarPacienteAcargo(vm.data.paciente.PacientesAMiCargo, pIndex,$scope)
			}
			/*--------------------------------------------- MENU CONTEXTUAL ---------------------------------------------*/

			$scope.menuOptionsP = [
				// NEW IMPLEMENTATION
				{
					text: "Agregar",
					displayed: function (modelValue) {
						return(modelValue.btnNewIf);
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						newPacienteAcargo();
					}
				},
				{
					text: "Eliminar",
					displayed: function (modelValue) {
						return(modelValue.btnDeleteIf);
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						deletePacienteAcargo($itemScope.$index);
					}
				}
			];
			$scope.menuOptionsR = [
				// NEW IMPLEMENTATION
				{
					text: "Agregar",
					displayed: function (modelValue) {
						return(modelValue.btnNewIf);
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						newResponsable();
					}
				},
				{
					text: "Eliminar",
					displayed: function (modelValue) {
						return(modelValue.btnDeleteIf);
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						deleteResponsable($itemScope.$index);
					}
				}
			];
			// /* ------------------------------ OTROS ------------------------------ */

			 function updateFechaNacimiento () {			
			// 	validarExistenciaPacientePorNombre();
			 	vm.data.paciente.FechaNacimiento = DateUtils.parseToFe(vm.data.paciente.FechaNacimiento);
			 }

			function incializarPacientNuevo(pacienteNuevo) {
				vm.data.paciente = pacienteNuevo;
				if(vm.data.paciente.NumeroDocumento === 0) vm.data.paciente.NumeroDocumento ='';
				if(vm.data.paciente.IdTipoSexo === 0) vm.data.paciente.IdTipoSexo ='';
				vm.data.paciente.FechaNacimiento = '';
				vm.data.paciente.Afiliaciones = vm.data.paciente.Afiliaciones.map(a => {
					a.FechaDesde = DateUtils.parseToFe(a.FechaDesde);
					a.FechaHasta = DateUtils.parseToFe(a.FechaHasta);
					return a;
				})
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();
			
			$scope.$watch(function () {
				return vm.data.paciente;
			}, function (newValue, oldValue, scope) {

				let nombre =  (newValue.Nombre) ? newValue.Nombre : '';
				let apellido =  (newValue.Apellido) ? newValue.Apellido : '';
				let documento =  (newValue.NumeroDocumento) ? newValue.NumeroDocumento : '';

				let nombreDoc = (newValue.TipoDocumentoPaciente) ? newValue.TipoDocumentoPaciente.Nombre : '';

				vm.title.pageEdit = `${vm.title.page}: ${nombre} ${apellido} - ${nombreDoc}: ${documento}`;

				// vm.title.pageEdit = vm.title.page + ': ' + newValue.Nombre + ' ' + newValue.Apellido + ' - '
				// 	+ nombreDoc + ': ' + newValue.NumeroDocumento;

			}, true);

			function activate () {
				$log.debug('Inicializar ON.-');
				inicializarVariables();
				$state.current.data.externo = $stateParams.externo;
				$state.current.data.menuIf = !$stateParams.externo;
				vm.externo.externo = $stateParams.externo;
				vm.externo.idTipoDocumento = $stateParams.idTipoDocumento;
				vm.externo.numeroDocumento = $stateParams.numeroDocumento;
				activateOk(Resolves);
			}

			function activateOk (pResponse) {
				vm.formControl.loading = false;
				vm.formControl.error = false;
				incializarPacientNuevo(pResponse[0]);
				vm.data.estadosCivil = pResponse[1];
				vm.data.nacionalidades = pResponse[2];
				vm.data.estadosPacired = pResponse[3];
				vm.data.tiposRelacionPaciente = pResponse[4];
				vm.data.tiposSexo = pResponse[5];
				vm.data.tiposPaciente = pResponse[6];

				initForm();
				$log.debug('Inicializar OK.-', pResponse);
			}
		}
	};

	return module;

})();