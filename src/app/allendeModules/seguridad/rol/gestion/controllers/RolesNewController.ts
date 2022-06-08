/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import { ISupportDataService } from '../../../../support/basic/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('RolesNewController', RolesNewController);

		// Inyección de Dependencia
		RolesNewController.$inject = ['$scope', 'Logger', '$q', '$uibModalInstance',
			'RolesGestionDataService', 'ModalService',
			'RolesGestionLogicService',
			'ModulosPermisoDataService', 'SupportDataService'
		];

		// Constructor del Controller
		function RolesNewController($scope, $log, $q, $uibModalInstance,
			RolesGestionDataService, ModalService,
			RolesGestionLogicService,
			ModulosPermisoDataService, SupportDataService: ISupportDataService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RolesNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;


			vm.data = {
				rol: {},
				rolesXPermiso: []
			};

			vm.formControl = {
				ok: guardarRol,
				cancel: cancel,
				error: true,
				loading: false,
				sistemaChanged: sistemaChanged

			};

			vm.filter = {
				data: {}
			}

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}



			function inicializarVariables() {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
			}


			function sistemaChanged() {
				$log.debug('cambie sistema', vm.data.sistema);
				if (vm.data.sistema) {
					//tengo sistema elejido entonces filtro
					vm.filter.data = '';
					vm.filter.data = angular.copy(vm.data.rolesXPermiso.filter(x => x.IdSistema === vm.data.sistema.Id));
					$log.debug('vm.filter.data', vm.filter.data);
				} else {
					vm.filter.data = angular.copy(vm.data.rolesXPermiso);
				}
			}



			function guardarRol(isValid) {

				$log.debug('isFormValid', isValid);
				if (isValid) {

					var _rol = vm.data.rol;
					_rol.VistaPlana = vm.filter.data;

					$log.debug(' guardarRol OK-', _rol, vm.data.rolesXPermiso);

					vm.formControl.loading = true;

					if (vm.data.sistema) {

						_rol.IdSistema = angular.copy(vm.data.sistema.Id);
					}

					RolesGestionDataService.validarGuardar(_rol)
						.then(addOk, addError);

				}

				function addOk(pResponse) {

					$log.debug("ValidacionNew", pResponse);

					if (pResponse.IsOk === true) {
						vm.formControl.loading = true;
						RolesGestionDataService.guardar(_rol)
							.then(function (pResp) {
								ModalService.success("Rol Creado");
								$uibModalInstance.close("result ok");
							}).catch(function (pErr) {
								vm.formControl.loading = false;
								ModalService.error("Error de servidor");
								$uibModalInstance.dismiss(pErr);
								$log.error('ValidacionNew .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							ModalService.error(pResponse.Message);
						else
							ModalService.error("Error de servidor");
						vm.formControl.loading = false;
					}

					vm.formControl.loading = false;
				}

				function addError(pError) {

					$uibModalInstance.dismiss(pError);
					$log.error(' GuardarHabitacion ERROR.-', pError);
				}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;
				// 
				var _rolNuevo = RolesGestionDataService.getNuevoRol();
				var _rolesXPermiso = ModulosPermisoDataService.getModuloYPermisosTodosLosSistemas();
				var _sistemasHabilitadosApp = SupportDataService.obtenerTodosLosSistemasApp();

				$q.all([
					_rolNuevo,
					_rolesXPermiso,
					_sistemasHabilitadosApp
				])
					.then(activateOk, activateError);

				function activateOk(pResults) {

					vm.formControl.loading = false;

					vm.data.rol = pResults[0];
					vm.data.rolesXPermiso = pResults[1];
					vm.filter.data = angular.copy(vm.data.rolesXPermiso);
					vm.data.sistemasApp = pResults[2]


					$log.debug('Inicializar OK.-', pResults);

				}

				function activateError(pError) {

					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}

				//inicializarVariables();
			}


		}
	};

	return module;
})();