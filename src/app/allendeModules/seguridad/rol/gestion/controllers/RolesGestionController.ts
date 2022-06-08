/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };
	module.init = function(module) {
		module.controller('RolesGestionController', RolesGestionController);
		// Inyeccion de dependencia
		RolesGestionController.$inject = ['$scope', '$filter', 'orderByFilter', 'Logger', '$q', '$interval',
			'RolesGestionDataService', 'ModulosPermisoDataService', 'PermisosDataService',
			'ModalService', 'uiGridConstants', '$state',
			// 'HABITACION_ORDER',
			'RolesGestionLogicService', 'RolesGestionAuthService',
			'User'
			//'Module'
		];
		// Constructor del Controller
		function RolesGestionController($scope, $filter, orderByFilter, $log, $q, $interval,
			RolesGestionDataService, ModulosPermisoDataService, PermisosDataService,
			ModalService, uiGridConstants, $state,
			//HABITACION_ORDER,
			RolesGestionLogicService, RolesGestionAuthService,
			User
			//Module
		) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('RolesGestionController');
			$log.debug('ON.-');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var vm = this;
			vm.title = {
				//module: Module
				page: $state.current.data.title
			};
			// vm.sucursal = User.Sucursal;
			vm.order = {};
			//vm.listOrderBy = HABITACION_ORDER;
			vm.formControl = {
				esAll: false,
				loading: false,
				stateLoading: false,
				reloadPage: activate
			};

			vm.data = {
				roles: {},
				permisos: {},
				rolNuevo: {},
				permisosXModulo: []
			};

			vm.rol = {
				edit: editRol,
				delete: deleteRol,
				new: newRol

			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};


			vm.filter = {
				id: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.validar = {

				puedeCrear: validarPuedeCrear,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEliminar

			};



			function inicializarVariables() {

				cleanFilters();
			}



			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			/* FORMULARIO */
			// function ok () {
			// 	$uibModalInstance.close($scope.formData.camaSeleccionada);
			// }
			// function cancel () {
			// 	$uibModalInstance.dismiss('cancel');
			// }


			function newRol() {

				$log.debug('newRol OK.-');

				if (RolesGestionAuthService.puedeCrear(User)) {

					RolesGestionLogicService.newRol(User)
						.then(newRolOk, newRolError);

				}


				function newRolOk(pResult) {

					activate();
				}

				function newRolError(pError) {

					$log.error('newRol OK.-', pError);

				}

			}

			function editRol(pRol) {

				$log.debug('editRol OK.-', pRol);

				if (RolesGestionAuthService.puedeEditar(User)) {

					var _id = pRol.Id;
					RolesGestionLogicService.editRol(_id)
						.then(editRolOk, editRolError);
				}


				function editRolOk(pResult) {
					activate();
				}

				function editRolError(pError) {

					$log.error('editRolError .-', pError);

				}

			}

			function deleteRol(pRol) {


				$log.debug('deleteRol OK.-', pRol);

				if (RolesGestionAuthService.puedeEliminar(User)) {

					RolesGestionLogicService.deleteRol(pRol)
						.then(deleteRol, deleteRolError);



				}

				function deleteRol(pResult) {
					activate();
				}

				function deleteRolError(pError) {

					$log.error('deleteRolError .-', pError);

				}



			}



			/* VALIDACIONES */

			function validarPuedeCrear() {
				return RolesGestionAuthService.puedeCrear(User);
			}

			function validarPuedeEditar() {
				return RolesGestionAuthService.puedeEditar(User);
			}

			function validarPuedeEliminar() {
				return RolesGestionAuthService.puedeEliminar(User);
			}


			/* PAGINACIÓN */
			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombreRol = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.id === null)
					vm.filter.id = '';
				if (vm.filter.nombreRol === null)
					vm.filter.nombreRol = '';
				// vm.order = {
				// 	id: 1,
				// 	value: 'Numero',
				// 	descripcion: 'Codigo (Asc)',
				// 	reverse: false
				// };
			}

			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.roles = orderByFilter(vm.data.roles, vm.order.value, vm.order.reverse);
				vm.filter.roles = $filter('filter')
					(vm.data.roles, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombreRol
					});
				vm.paginacion.totalItems = vm.filter.roles.length;
				vm.filter.roles = vm.filter.roles.slice(begin, end);
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {


				$log.debug('User OK.-', User);

				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;


				var _roles = RolesGestionDataService.getAll();

				//var _rolNuevo = RolesGestionDataService.getNuevoRol();
				//var _rol1 = RolesGestionDataService.getRolByIdConModulosYPermisos(51);

				//var _modulos = ModulosPermisoDataService.getAll();
				//var _modulo1 = ModulosPermisoDataService.getModuloById(1);
				//var _permisos = PermisosDataService.getAllPermiso();


				$q.all([
						_roles,

					])
					.then(activateOk, activateError);

				function activateOk(pResults) {


					vm.data.roles = pResults[0];

					// vm.data.permisos = pResults[1];
					// vm.data.rolNuevo = pResults[2];

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 10;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

					$log.debug('Inicializar OK.-', pResults);
				}

				function activateError(pError) {
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

					//$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		}
	};
	return module;
})();
