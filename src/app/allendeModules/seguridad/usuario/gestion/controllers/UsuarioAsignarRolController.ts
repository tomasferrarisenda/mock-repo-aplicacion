/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('UsuarioAsignarRolController', UsuarioAsignarRolController);

		// Inyección de Dependencia
		UsuarioAsignarRolController.$inject = ['$scope', '$filter', '$rootScope', 'orderByFilter', 'Logger', '$q', '$state',
			'UsuarioGestionDataService', 'ModalService',
			'UsuarioGestionLogicService',
			'ModulosPermisoDataService',
			'User',
			'Usuario'
		];

		// Constructor del Controller
		function UsuarioAsignarRolController($scope, $filter, $rootScope, orderByFilter, $log, $q, $state,
			UsuarioGestionDataService, ModalService,
			UsuarioGestionLogicService,
			ModulosPermisoDataService,
			User,
			Usuario
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioAsignarRolController');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.title = {
				page: 'Usuario: ' + Usuario.Nombre
			};

			vm.data = {
				usuario: Usuario,
				vistaPlana: [],
				rolesChecked: [],
				permisosASacar: [],
				permisosTrue: [],
				permisosFalse: []
			};

			vm.formControl = {

				volver: volver,
				error: true,
				loading: false,
				save: guardar,
				openAsignar: openAsignar,
				reloadPage: activate
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

			vm.dataManage = {
				actualizarVistaPlana: actualizarVistaPlana
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function volver() {
				$state.go('usuario.gestion.list');
			}

			function inicializarVariables() {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
			}

			function guardar() {
				
				$log.debug('data usuario to save',vm.data.usuario);
				
				vm.formControl.loading = true;

				UsuarioGestionDataService.guardar(vm.data.usuario)
					.then(addOk, addError);

				function addOk(pResponse) {

					$log.debug("ValidacionNew", pResponse);

					if (pResponse.IsOk === true) {
						ModalService.success("Usuario Editado");
						$state.go('usuario.gestion.list');
						vm.formControl.loading = false;
					} else {
						ModalService.error(pResponse.Message);
						vm.formControl.loading = false;
					}
				}

				function addError(pError) {
					ModalService.error(pError.Message);
					$log.error(' guardarUsuario ERROR.-', pError);
				}
			}




			function openAsignar(data, rol) {
				var _rol;
				_rol = angular.copy(rol);

				if (data === true) {

					vm.data.rolesChecked.push(_rol);
					$rootScope.$broadcast('mostrarPermisosPorRow', _rol.IdsPermisosDelRol);
					vm.dataManage.actualizarVistaPlana(_rol, true);

				} else {

					var rolASacar;
					vm.data.rolesChecked = $.grep(vm.data.rolesChecked, function (e: any) {

						if (e.Id === _rol.Id) {

							rolASacar = angular.copy(_rol);

						}

						return e.Id != _rol.Id;
					});

					var permisosNoSacar: Array<any> = [];

					angular.forEach(rolASacar.IdsPermisosDelRol, function (idAComparar, key) {

						angular.forEach(vm.data.rolesChecked, function (roles, key) {

							angular.forEach(roles.IdsPermisosDelRol, function (value, key) {

								if (value === idAComparar) {
									permisosNoSacar.push(idAComparar);
								}

							});

						});


					});

					//deprecated
					// var _permisosXSacar = rolASacar.IdsPermisosDelRol.diff(permisosNoSacar.unique());
					// var _permisosXSacar = rolASacar.IdsPermisosDelRol.diff([...new Set(permisosNoSacar)]);

					//no se puede usar mas el set, pero por las dudas si anda el set
					// var _permisosXSacar = rolASacar.IdsPermisosDelRol.filter(item => [...new Set(permisosNoSacar)].indexOf(item)<0);
					var _permisosNoSacarUnique = permisosNoSacar.filter(onlyUnique);

					var _permisosXSacar = rolASacar.IdsPermisosDelRol.filter(item => _permisosNoSacarUnique);

					$log.debug('los PERMISOS a SACAR son.-', _permisosXSacar);

					$log.debug('el rol a sacar ANTES DEL REMOVE es.-', rolASacar);

					if (_permisosXSacar) {

						$log.debug('entre.-', _permisosXSacar);

						rolASacar.IdsPermisosDelRol = _permisosXSacar;
					}


					vm.dataManage.actualizarVistaPlana(rolASacar, false);

				}

			}

			function onlyUnique(value, index, self) {
				return self.indexOf(value) === index;
			}


			function actualizarVistaPlana(rol, state) {


				angular.forEach(rol.IdsPermisosDelRol, function (idRol, key) {

					angular.forEach(vm.data.vistaPlana, function (value, key) {

						if (value.IdTipo === 1) {

							if (idRol === value.Id)
								value.Seleccionado = state;

						}


					});

				});
			}

			/* PAGINACIÓN */
			function cleanFilters() {
				vm.filter.id = '';
				vm.filter.nombreRol = '';
				vm.filter.rolesActivos = false;
				vm.paginacion.pageChanged();
			}


			function validarFilters() {
				if (vm.filter.id === null)
					vm.filter.id = '';
				if (vm.filter.nombreRol === null)
					vm.filter.nombreRol = '';

				vm.order = {
					id: 1,
					value: 'Nombre',
					descripcion: 'Nombre (Asc)',
					reverse: false
				};

			}


			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.roles = orderByFilter(vm.data.roles, vm.order.value, vm.order.reverse);
				vm.filter.roles = $filter('filter')
					(vm.data.roles, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombreRol,
						Seleccionado: vm.filter.rolesActivos
					});
				vm.paginacion.totalItems = vm.filter.roles.length;
				vm.filter.roles = vm.filter.roles.slice(begin, end);
			}



			/* FUNCIONES PROTOTYPE DE MANEJO DE ARRAY */
			//toma el array y elimina los repetidos
			// Array.prototype.unique = function(a) {
			// 	return function() {
			// 		return this.filter(a)
			// 	};
			// }(function(a, b, c) {
			// 	return c.indexOf(a, b + 1) < 0
			// });

			// //toma un array y saca la diferencia con otro
			// Array.prototype.diff = function(a) {
			// 	return this.filter(function(i) {
			// 		return a.indexOf(i) < 0;
			// 	});
			// };


			// Array.prototype.remove = function() {
			// 	var what, a = arguments,
			// 		L = a.length,
			// 		ax;
			// 	while (L && this.length) {
			// 		what = a[--L];
			// 		while ((ax = this.indexOf(what)) !== -1) {
			// 			this.splice(ax, 1);
			// 		}
			// 	}
			// 	return this;
			// };

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				vm.filter.rolesActivos = true;

				vm.formControl.loading = true;
				vm.data.roles = vm.data.usuario.Roles;
				vm.data.vistaPlana = vm.data.usuario.VistaPlana

				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 6;
				vm.paginacion.getPage();
				vm.formControl.loading = false;
				vm.formControl.stateLoading = false;

				angular.forEach(vm.data.usuario.Roles, function (value, key) {

					if (value.Seleccionado) {
						vm.data.rolesChecked.push(value);
					}

				});


			}


		}
	};

	return module;
})();
