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

		module.controller('RolesEditController', RolesEditController);

		// Inyección de Dependencia
		RolesEditController.$inject = ['$scope', 'Logger', '$q', '$uibModalInstance',
			'RolesGestionDataService', 'ModalService', 'SupportDataService',
			'RolesGestionLogicService',
			'ModulosPermisoDataService',
			'IdRolSelected'
		];

		// Constructor del Controller
		function RolesEditController($scope, $log, $q, $uibModalInstance,
			RolesGestionDataService, ModalService, SupportDataService: ISupportDataService,
			RolesGestionLogicService,
			ModulosPermisoDataService,
			IdRolSelected
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RolesEditController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;


			vm.data = {
				rol: {},
				rolesXPermiso: []
			};

			vm.formControl = {
				ok: guardarRolEditado,
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

			function sistemaChanged() {
				$log.debug('cambie sistema', vm.data.sistema);
				if (vm.data.sistema) {
					//tengo sistema elejido entonces filtro
					vm.filter.data = '';
					vm.filter.data = angular.copy(vm.data.rol.VistaPlana.filter(x => x.IdSistema === vm.data.sistema.Id));
					$log.debug('vm.filter.data', vm.filter.data);
					matchPermisosEdit();

				} else {
					vm.filter.data = angular.copy(vm.data.rolesXPermiso);
					matchPermisosEdit();
				}
			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			function guardarRolEditado() {

				var _rol = vm.data.rol;
				_rol.VistaPlana = angular.copy(vm.filter.data);

				$log.debug(' guardarRolEditado OK-', _rol);

				vm.formControl.loading = true;

				RolesGestionDataService.validarGuardar(_rol)
					.then(addOk, addError);

				function addOk(pResponse) {

					$log.debug("ValidacionNew", pResponse);

					if (pResponse.IsOk === true) {
						vm.formControl.loading = true;
						RolesGestionDataService.guardar(_rol)
							.then(function (pResp) {
								ModalService.success("Rol Editado");
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

					//vm.formControl.loading = false;
				}

				function addError(pError) {

					$uibModalInstance.dismiss(pError);
					$log.error(' GuardarHabitacion ERROR.-', pError);
				}
			}


			function matchPermisosEdit() {

				angular.forEach(vm.data.rol.VistaPlana, function (itemPlanoObtenido) {

					if (itemPlanoObtenido.PuedeSeleccionar)
						vm.filter.data.find(x => x.Id === itemPlanoObtenido.Id && x.IdSistema === itemPlanoObtenido.IdSistema).Seleccionado = angular.copy(itemPlanoObtenido.Seleccionado);

				});

			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				var _rolObtenido = RolesGestionDataService.getRolByIdConModulosYPermisos(IdRolSelected);
				var _sistemasHabilitadosApp = SupportDataService.obtenerTodosLosSistemasApp();
				var _rolesXPermiso = ModulosPermisoDataService.getModuloYPermisosTodosLosSistemas();

				$q.all([
					_rolObtenido,
					_sistemasHabilitadosApp,
					_rolesXPermiso
				])
					.then(activateOk, activateError);

				function activateOk(pResults) {


					vm.data.rol = pResults[0];
					vm.data.sistemasApp = pResults[1];
					vm.data.rolesXPermiso = pResults[2];
					vm.filter.data = angular.copy(vm.data.rolesXPermiso);
					vm.formControl.loading = false;

					//levanto el sistema obtenido
					if (vm.data.rol.IdSistema)
						vm.data.sistema = vm.data.sistemasApp.find(x => x.Id === vm.data.rol.IdSistema);

					sistemaChanged();

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
