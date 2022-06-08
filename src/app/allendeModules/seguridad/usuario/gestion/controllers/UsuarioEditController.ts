/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import { IPacienteDataService } from '../../../../persona/paciente/services';
import { IProfesionalesDataService } from '../../../../profesionales';

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('UsuarioEditController', UsuarioEditController);

		// Inyección de Dependencia
		UsuarioEditController.$inject = ['$scope', 'Logger', '$filter', 'orderByFilter', '$q',
			'UsuarioGestionDataService', 'AlertaService', '$state', '$stateParams', 
			'PacienteDataService', 'ProfesionalesDataService',
			'ModulosPermisoDataService', 'StateHelperService'
		];

		// Constructor del Controller
		function UsuarioEditController($scope, $log, $filter, orderByFilter, $q,  
			UsuarioGestionDataService, AlertaService: IAlertaService, $state, $stateParams,
			PacienteDataService: IPacienteDataService, ProfesionalesDataService: IProfesionalesDataService,
			ModulosPermisoDataService, StateHelperService: IStateHelperService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioEditController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.title = {
				page: $state.current.data.title,
				icon: $state.current.data.icon
			};

			vm.data = {
				idUsuarioSelected: $stateParams.idUsuario,
				usuario: {},
				rolesXPermiso: []
			};

			vm.data.regPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,14}$/;

			vm.formControl = {
				ok: guardarUsuario,
				cancel: cancel,
				error: true,
				loading: false,
				compare: compare,
				isAllende: false,
				validarUserName: validarUserName,
				puedeGuardarConPass: puedeGuardarConPass,
				getPorDefectoCheck: getPorDefectoCheck,
				asignarAPaciente: false,
				asignarAProfesional: false

			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.filter = {
				clean: cleanFilters,
				validar: validarFilters
			};


			vm.statusUsuario = [{
				texto: 'Activo',
				activo: true
			}, {
				texto: 'Desactivo',
				activo: false
			}]

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */


			/* PAGINACIÓN */
			function cleanFilters() {
				vm.filter.legajo = '';
				vm.filter.nombre = '';
				vm.filter.nombreUsuario = '';
				vm.filter.tipo = '';
				vm.filter.estadoUsuario = '';
				vm.paginacion.pageChanged();
				vm.formData = '';
			}

			function validarFilters() {
				if (vm.filter.legajo === null)
					vm.filter.legajo = '';
				if (vm.filter.nombre === null)
					vm.filter.nombre = '';
				if (vm.filter.nombreUsuario === null)
					vm.filter.nombreUsuario = '';


				vm.order = {
					id: 1,
					value: 'Legajo',
					descripcion: 'Legajo (Asc)',
					reverse: false
				};
			}

			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				//vm.data.usuarios = orderByFilter(vm.data.usuarios, vm.order.value, vm.order.reverse);
				vm.filter.usuariosToSelect = $filter('filter')
					(vm.data.usuariosToSelect, {
						Legajo: vm.filter.legajo,
						Nombre: vm.filter.nombre,
						UserName: vm.filter.nombreUsuario

					});
				vm.paginacion.totalItems = vm.filter.usuariosToSelect.length;
				vm.filter.usuariosToSelect = vm.filter.usuariosToSelect.slice(begin, end);
			}


			/* FORMULARIO */

			function cancel() {
				
				StateHelperService.goToPrevState();	

			}


			function validarUserName() {

				if (!angular.isUndefined(vm.data.usuario.UserName)) {

					var res = vm.data.usuario.UserName.split("@");
					res[0] = $filter('lowercase')(res[0]);
					res[1] = $filter('lowercase')(res[1]);
					if (res[1] == "sanatorioallende.com") {
						vm.formControl.isAllende = false;

					} else vm.formControl.isAllende = true;
				}
			}


			function puedeGuardarConPass() {


				if (!vm.data.usuario.Password) {

					return true;

				} else {

					if (vm.formControl.isAllende) {

						if (!vm.formControl.isconfirm)
							return false;
					}
					return true;
				}

			}


			function inicializarVariables() {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
			}

			function compare() {

				vm.formControl.isconfirm = vm.data.usuario.Password == vm.data.Password2 ? true : false;
			}


			function guardarUsuario() {


				//vm.data.usuario.Legajo = vm.data.LegajoEmpty;
				var _usuario = vm.data.usuario;

				$log.debug('usuarioa editar', vm.data.usuario);

				if (vm.formControl.asignarAProfesional && vm.data.profesionalUsuario) {
					_usuario.IdProfesional = vm.data.profesionalUsuario.Id;
				}else if(vm.formControl.asignarAProfesional === false){
					_usuario.IdProfesional = 0;
				}

				if (vm.formControl.asignarAPaciente) {

					_usuario.IdPaciente = vm.data.pacienteUsuario.Id;
				}else if(vm.formControl.asignarAProfesional === false){
					_usuario.IdPaciente = 0;
				}


				if (vm.formControl.copiarUsuario == true) {

					if (angular.isUndefined(vm.formData)) {

						$log.debug('vm.formData is undefined');

						AlertaService.NewWarning('Alerta', 'Debe elegir un usuario para copiar');


					} else {

						$log.debug('copiar usuario is OK', vm.formData.recursoSeleccionado);
						$log.debug('Usuario to guardar', vm.data.usuario);

						vm.data.usuario.IdUsuarioCopia = angular.copy(vm.formData.recursoSeleccionado.Id);

						guardarConfirm(vm.data.usuario);

					}

				} else {
					vm.data.usuario.IdUsuarioCopia = 0;
					guardarConfirm(vm.data.usuario);
				}


				function guardarConfirm(userCompleto) {
					vm.formControl.loading = true;

					UsuarioGestionDataService.editarUsuario(userCompleto)
						.then(addOk, addError);

					function addOk(pResponse) {
						if (pResponse.IsOk === true) {
							vm.formControl.loading = false;

							// $uibModalInstance.close("result ok");
							AlertaService.NewSuccess("Completado","Usuario Editado");
							StateHelperService.goToPrevState();	
						} else {
							AlertaService.NewError("Error", pResponse.Message)
							// $uibModalInstance.dismiss(pResponse);
							vm.formControl.loading = false;	
						}
					}

					function addError(pError) {
						AlertaService.NewError("Error", pError)
						$log.error(' guardarUsuario ERROR.-', pError);
						// $uibModalInstance.dismiss(pError);
						vm.formControl.loading = false;
					}
				}

			}


			function checkIfIsAllende(usuario) {

				if (!angular.isUndefined(usuario.UserName)) {

					var res = usuario.UserName.split("@");
					if (res[1] == "sanatorioallende.com") {
						vm.formControl.isAllende = false;

					} else vm.formControl.isAllende = true;
				}

			}

			function getPorDefectoCheck() {
                var ret = false;
                angular.forEach(vm.data.usuario.EmpresasHabilitadas, function (empresa, key) {
                    if(empresa.PorDefecto) ret = true;
                });
                return ret; 
            }

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {

				vm.formControl.loading = true;

				var _usuarioObtenido = UsuarioGestionDataService.getUsuarioByIdParaEditar(vm.data.idUsuarioSelected);
				var _usuarios = UsuarioGestionDataService.obtenerTodos();

				$q.all([
						_usuarioObtenido, _usuarios
					])
					.then(activateOk, activateError);

				function activateOk(pResults) {

					vm.formControl.loading = false;

					vm.data.usuario = pResults[0];
					vm.data.usuariosToSelect = pResults[1];

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 4;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
					vm.filter.clean();


					$log.debug('user to edit', vm.data.usuario);

					if (vm.data.usuario.IdPaciente !== 0){

						vm.formControl.asignarAPaciente = true;
						PacienteDataService.obtenerPacientePorIdSelector(vm.data.usuario.IdPaciente)
							.then(function (pPaciente) {

								vm.data.pacienteUsuario = angular.copy(pPaciente);

							}, function (pError) {
								$log.error('obtenerPacientePorIdError', pError);
							});

					}

					if (vm.data.usuario.IdProfesional !== 0){
						
						vm.formControl.asignarAProfesional = true;
						ProfesionalesDataService.getProfesionalById(vm.data.usuario.IdProfesional)
						.then(function (pResult) {
							
							$log.debug('getProfesionalById ',pResult);
							var _pacienteToLoad: any = {};
							_pacienteToLoad.Id =  angular.copy(pResult.numero_matricula);
							_pacienteToLoad.Matricula = angular.copy(pResult.numero_matricula);
							_pacienteToLoad.IdProfesional = angular.copy(pResult.numero_matricula);
							_pacienteToLoad.Nombre = angular.copy(pResult.nombre_completo);

							vm.data.profesionalUsuario = angular.copy(_pacienteToLoad);

						}, function (pError) {
							$log.error('obtenerProfesionalPorIdError', pError);

						})

					}

					checkIfIsAllende(vm.data.usuario);

				}

				function activateError(pError) {

					// $uibModalInstance.dismiss(pError);
					StateHelperService.goToPrevState();	
					$log.error('Inicializar ERROR.-', pError);
				}

				//inicializarVariables();
			}


		}
	};

	return module;
})();