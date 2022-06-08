/**
 * @author 			emansilla
 * @description 	description
 */

import * as angular from 'angular';
import { IPacienteDataService } from '../services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PacienteEditController', PacienteEditController);

		PacienteEditController.$inject = [
		'$scope', 'Logger', '$q', '$filter','$state', '$stateParams',
		'PacienteDataService', 'ModalService',
		'PacienteLogicService', 'MutualLogicService', 'User','StateHelperService','DateUtils',
		'PacienteAuthService', 'Resolves', 'AlertaService'];

		function PacienteEditController ($scope, $log, $q, $filter,$state, $stateParams,
			PacienteDataService: IPacienteDataService, ModalService: IModalService,
			PacienteLogicService, MutualLogicService, User,StateHelperService: IStateHelperService, DateUtils: IDateUtils,
			PacienteAuthService, Resolves, AlertaService: IAlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteEditController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.today = new Date();

			vm.idPaciente = $stateParams.idPaciente;
			vm.title = {
				page: $state.current.data.title,
				icon: $state.current.data.icon
			};
			vm.tabs = [];

			vm.formData = {
				fechaNacimiento : ''
			};

			vm.data = {
				paciente: {},
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
				reloadPage: activate,
				updateFechaNacimiento : updateFechaNacimiento,
				validarForm : validarForm,
				save : guardarPaciente,
				cancel : cancel,
				pacienteValidado : true,
				pacienteFusionado : false,
				permisoEditarEstadoEmpadronamiento : false,
				permisoEditarTipoPaciente : false,
				deshabilitaEditarNombre : true,
				deshabilitaEditarDocumento : true,
				numeroDocumentoRequerido : true,
				NumeroDocumentoHabilitado : true,
				TipoDocumentoHabilitado : true,
				btnAgregaApellidoDesahabilitado : false,
				validaNumeroDocumentoHabilitado : validaNumeroDocumentoHabilitado,
				validaNumeroDocumentoRequerido :validaNumeroDocumentoRequerido,
				validarPacientePorDocumento : validarExistenciaPacientePorDocumento,
				validarPacientePorNombre : validarExistenciaPacientePorNombre,
				visualizaEstadosPaciente : visualizaEstadosPaciente,
				visualizaTiposPaciente : visualizaTiposPaciente,
				agregarApellido : agregarApellidoDesdeNombre,
				agregarNombre : agregarNombreDesdeApellido,
				today : new Date(),
				tipoDocumentoSelectDefault : false,
				puedeFusinarPaciente : false,
				puedeEditarInformeWeb : false,
				disabledSave: disabledSave,
				saveDisabled: false
			};

			vm.responsable = {
				open : newResponsable,
				delete : deleteResponsable,
				changeDefecto : cambiarResponsablePorDefecto
			};
			vm.pacientesAmiCargo = {
				open : newPacienteAcargo,
				delete : deletePacienteAcargo
			};
			vm.filter = {	
					currentPage: 1,
					pageSize : 10,
					filtroNuevo : {},
					numeroDocumentoAnterior : 0,
					apellidoAnterior : "",
					nombreAnterior :"",
				};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function inicializarVariables () {
				PacienteDataService.generarCriterioBusqueda().then(function(pFiltros){
						vm.filter.filtroNuevo = pFiltros;
						//$log.debug('Filtros',vm.filter.filtros);
					});
			}

			function validarForm () {
				// Por formulario ya se valida la tab-general.
			}

			function initForm () {
				vm.tabs = PacienteAuthService.getTabs($state.current.data.idPermiso, User);
				//$log.debug('PacienteValidado', vm.data.paciente);
				//1)paciente validado 
				// 		- modificar nombre por las flechas solo el que tenga permiso para editar estado empadronamiento.
				// 2)paciente fusionado
				// 			- nadie puede modificar nada del paciente.
				// 3)paciente sin validar o incompleto. ( solo habilitado para el usuario que tenga permiso)
				// 		- todos los usuarios pueden modificar en nombre con las flechas.
				// 		- el cambio de estado de incompleto a sin validar o viceversa . (logica del sistema)
				//4)usuario con permiso de editar estado empadronamiento se habilita el combo de estados
				//5)los RN podran unificarse como en HC 
				//	- paciente fusionado NO puede hacer nada
				//	- paciente validado - modificar nombre por las flechas, tipo y numero de documento solo el que tenga permiso para editar estado empadronamiento y editar datos basicos.				
				//	- paciente sin validar o incompleto. ( solo habilitado para el usuario que tenga permiso)
				if(!vm.data.paciente.TipoDocumentoPacienteBase){
					vm.data.paciente.TipoDocumentoPacienteBase = {}
				}
				//Guardo el tipo de documento que viene del back para validar los tipos de documentos elegibles
				vm.data.paciente.TipoDocumentoPacienteBase = angular.copy(vm.data.paciente.TipoDocumentoPaciente);

				vm.formControl.pacienteValidado = vm.data.paciente.PacienteValidado;
				
				vm.formControl.pacienteFusionado = vm.data.paciente.PacienteFusionado;
				vm.formControl.puedeFusinarPaciente = vm.data.paciente.PuedeFusinarPaciente;
				if(vm.formControl.puedeFusinarPaciente || vm.data.paciente.PuedeEditarInformeWeb)
					vm.formControl.puedeEditarInformeWeb = true;

				if(vm.formControl.puedeFusinarPaciente) 
					vm.formControl.pacienteValidado = false;

				if(vm.formControl.pacienteFusionado){
					if(!vm.formControl.puedeFusinarPaciente) {
						AlertaService.NewWarning('Alerta', 'El paciente se encuentra fusionado, no se puede modificar');
					}
					else {
						AlertaService.NewWarning('Alerta', 'El paciente se encuentra fusionado');
					}	
				}

				vm.formControl.permisoEditarEstadoEmpadronamiento = vm.data.paciente.PuedeEditarEstadoEmpadronamiento;
				vm.formControl.permisoEditarTipoPaciente = vm.data.paciente.PuedeEditarTipoDePaciente;

				if((vm.formControl.pacienteFusionado || vm.data.paciente.PacienteValidado)&& !vm.formControl.puedeFusinarPaciente ){
					vm.formControl.btnAgregaApellidoDesahabilitado = true;
				}
				if((!vm.formControl.pacienteFusionado && vm.data.paciente.PuedeEditarDatosBasicos) ||vm.formControl.puedeFusinarPaciente ){
					if((vm.formControl.puedeFusinarPaciente)
						|| (vm.data.paciente.TipoDocumentoPaciente.RecienNacido && vm.data.paciente.PuedeModificarTipoDocumentosRecienNacido)
						|| (!vm.data.paciente.PacienteValidado && !vm.formControl.pacienteFusionado && vm.data.paciente.PuedeModificarApellidoNombrePaciente)
					){
						vm.formControl.deshabilitaEditarNombre = false;
					}
					validaNumeroDocumentoHabilitado();
					validaTipoDocumentoHabilitado();
				}
				
				//Elimino el tipo de sexo Sin Datos para que no se pueda elegir
				if(!vm.formControl.pacienteValidado && vm.data.paciente.IdTipoSexo == 0) {
					vm.data.paciente.IdTipoSexo = null;
					//vm.data.tiposSexo = PacienteLogicService.filtarTipoSexoElegible(vm.data.tiposSexo);
				}
			}

			function disabledSave(){
				vm.formControl.saveDisabled = true;
				setTimeout(() => {
					vm.formControl.saveDisabled = false;
					}, 1000);
			}

			function guardarPaciente (form) {
				if (form.$valid || (form.formTabMutuales.$invalid && !form.$error.hasOwnProperty("required") && form.$error.pattern[0].$name == "formTabMutuales")) {
					//si cambio el tipo de documento valido que sea uno elegible
					if(vm.data.paciente.TipoDocumentoPacienteBase.Id !== vm.data.paciente.TipoDocumentoPaciente.Id){
						if(!PacienteLogicService.validarTipoDeDocumentoElegible(vm.data.paciente)){
							ModalService.info('El tipo de Documento elegido no es valido.');
						}
						else{
							PacienteLogicService.confirmarCreacionPaciente('¿Desea guardar el paciente con los nuevos datos?',vm.data.paciente);
						}
					}else{
						PacienteLogicService.confirmarCreacionPaciente('¿Desea guardar el paciente con los nuevos datos?',vm.data.paciente);
					}
					
				}else {
					form.$setSubmitted();
					// form.formTabGeneral.$setSubmitted();
					// form.formTabMutuales.$setSubmitted();
				}
			}
			function cancel (pPristine) {
				PacienteLogicService.cancelar(pPristine);
				//StateHelperService.goToPrevState();
			}

			function visualizaEstadosPaciente() {				
				return PacienteLogicService.validarVisualizaEstadosPaciente(vm.data.paciente);
			}
			
			function visualizaTiposPaciente() {
				return PacienteLogicService.validarVisualizaTiposPaciente(vm.data.paciente);
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

			function agregarApellidoDesdeNombre(pPaciente) {
				var pacienteModificado = PacienteLogicService.agregarApellidoDesdeNombre(pPaciente);
				vm.data.paciente.Nombre = pacienteModificado.Nombre;
				vm.data.paciente.Apellido = pacienteModificado.Apellido;
				$scope.formPaciente.$setDirty();

			}
			
			function agregarNombreDesdeApellido(pPaciente) {
				var pacienteModificado = PacienteLogicService.agregarNombreDesdeApellido(pPaciente);
				vm.data.paciente.Nombre = pacienteModificado.Nombre;
				vm.data.paciente.Apellido = pacienteModificado.Apellido;
				$scope.formPaciente.$setDirty();

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
			/* ------------------------------ OTROS ------------------------------ */

			function updateFechaNacimiento () {
				// vm.data.paciente.fecha_nacimiento = $filter('date')(vm.formData.fechaNacimiento, 'dd/MM/yyyy');
				vm.data.paciente.fecha_nacimiento = vm.formData.fechaNacimiento;
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
			},true);

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar ON.-(Externo)',$stateParams.externo);
				$state.current.data.externo = $stateParams.externo;
				$state.current.data.menuIf = !$stateParams.externo;
				if ($stateParams.idPaciente || $stateParams.idPacienteOld) {
				
					inicializarVariables();
					vm.formControl.loading = true;
					vm.formControl.error = false;
					activateOk(Resolves);

				} else {
					cancel(true);
				}

			}

			function activateOk (pResponse) {
				vm.formControl.loading = false;
				
				vm.data.paciente = pResponse[0];
				vm.data.estadosCivil = pResponse[1];
				vm.data.nacionalidadPaciente = vm.data.paciente.Nacionalidades;			
				vm.data.paciente.FechaNacimiento = DateUtils.parseToFe(vm.data.paciente.FechaNacimiento);
				vm.data.paciente.Afiliaciones = vm.data.paciente.Afiliaciones.map(a => {
					a.FechaDesde = DateUtils.parseToFe(a.FechaDesde);
					a.FechaHasta = DateUtils.parseToFe(a.FechaHasta);
					return a;
				})
				
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