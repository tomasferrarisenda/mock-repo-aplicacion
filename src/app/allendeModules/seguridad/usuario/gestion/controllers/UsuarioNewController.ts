/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('UsuarioNewController', UsuarioNewController);

		// Inyección de Dependencia
		UsuarioNewController.$inject = ['$scope', 'Logger', '$filter', 'orderByFilter', '$q', '$state',
			'UsuarioGestionDataService', 'AlertaService', 'StateHelperService'
		];

		// Constructor del Controller
		function UsuarioNewController($scope, $log, $filter, orderByFilter, $q, $state,
			UsuarioGestionDataService,  AlertaService: IAlertaService, StateHelperService

		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.title = {
				page: $state.current.data.title,
				icon: $state.current.data.icon
			};

			vm.data = {
				usuario: {},
				rolesXPermiso: [],

			};

			vm.data.regPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,14}$/;

			vm.formControl = {
				ok: guardarUsuario,
				cancel: cancel,
				error: true,
				loading: false,
				isAllende: false,
				validarUserName: validarUserName,
				compare: compare,
				passwordC: true,
				puedeGuardarConPass: puedeGuardarConPass,
				copiarUsuario: false,
				getPorDefectoCheck: getPorDefectoCheck,
				asignarAPaciente: false,
				asignarAProfesional : false

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
				// $uibModalInstance.dismiss('cancel');
				StateHelperService.goToPrevState();	
			}



			function inicializarVariables() {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
			}


			function validarUserName() {

				if (!angular.isUndefined(vm.data.usuario.UserName)) {

					var res = vm.data.usuario.UserName.split("@");
					res[0] = $filter('lowercase')(res[0]);
					res[1] = $filter('lowercase')(res[1]);
					if (res[1] === "sanatorioallende.com") {
						vm.formControl.isAllende = false;

					} else vm.formControl.isAllende = true;
				}
			}

			function compare() {

				vm.formControl.isconfirm = vm.data.usuario.Password == vm.data.Password2 ? true : false;
			}

			function puedeGuardarConPass() {

				if (vm.formControl.isAllende) {

					if (!vm.formControl.isconfirm)
						return true;
				}

				return false;
			}



			function guardarUsuario() {

				vm.data.usuario.Legajo = vm.data.LegajoEmpty;
				vm.data.usuario.Activo = true;
				var _usuario = vm.data.usuario;

				if (vm.formControl.asignarAProfesional && vm.data.profesionalUsuario){
					_usuario.IdProfesional = vm.data.profesionalUsuario.Id;
				}

				if (vm.formControl.asignarAPaciente){

					_usuario.IdPaciente = vm.data.pacienteUsuario.Id;
				}


				vm.formControl.loading = true;

				if (vm.formControl.copiarUsuario == true) {

					if (angular.isUndefined(vm.formData)) {

						$log.debug('vm.formData is undefined');
						vm.formControl.loading = false;

						AlertaService.NewWarning('Alerta', 'Debe elegir un usuario para copiar');

					} else {
					
						vm.data.usuario.IdUsuarioCopia = angular.copy(vm.formData.recursoSeleccionado.Id);
						
						$log.debug('Usuario to guardar', vm.data.usuario);
						guardarConfirm(vm.data.usuario);

					}

				} else {
					vm.data.usuario.IdUsuarioCopia = 0;
					$log.debug('Usuario to guardar', vm.data.usuario);
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
							AlertaService.NewSuccess("Completado","Usuario Creado")
							StateHelperService.goToPrevState();	
							
						} else {
							AlertaService.NewError("Error", pResponse.Message)
							// StateHelperService.goToPrevState();	
							// $uibModalInstance.dismiss(pResponse);
							vm.formControl.loading = false;
						}
					}

					function addError(pError) {
						AlertaService.NewError("Error", pError)
						$log.error(' guardarUsuario ERROR.-', pError);
					}

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

				$log.debug('Inicializar UsuarioNewController ON.-');
				vm.formControl.loading = true;

				var _usuarioNuevo = UsuarioGestionDataService.obtenerNuevo();
				var _usuarios = UsuarioGestionDataService.obtenerTodos();
				// var _rolesXPermiso = ModulosPermisoDataService.getModuloYPermisosPorSistema();

				$q.all([
						_usuarioNuevo,
						_usuarios
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

					$log.debug('usuario obtenido nuevo', vm.data.usuario);


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
