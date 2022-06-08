/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import { StateHelperService } from 'src/app/common/router/services/StateHelperService';

export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('UsuarioAsignarExcepcionController', UsuarioAsignarExcepcionController);

		// Inyección de Dependencia
		UsuarioAsignarExcepcionController.$inject = ['$scope', 'Logger', '$filter', '$rootScope', 'orderByFilter',
			'$q', '$state', 'StateHelperService',
			'UsuarioGestionDataService', 'ModalService',
			'UsuarioGestionLogicService',
			'ModulosPermisoDataService',
			'User',
			'Usuario'
		];

		// Constructor del Controller
		function UsuarioAsignarExcepcionController($scope, $log, $filter, $rootScope, orderByFilter, $q, $state,
			StateHelperService,
			UsuarioGestionDataService, ModalService,
			UsuarioGestionLogicService,
			ModulosPermisoDataService,
			User,
			Usuario
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioAsignarExcepcionController');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.showDivAgregarExcepcion = false;

			vm.title = {
				page: 'Usuario: ' + Usuario.Nombre
			};

			vm.data = {

				usuario: Usuario,
				excepciones: {},
				rolesXPermiso: [],
				tipoExcepcion: {},
				tipoEntidadExcepcion: {},
				entidadExcepciones: {},
				usuarioAGuardar: [],
				tipoEntidadesObtenidas: [],
				nuevoExcepcion: {},
				nuevoEntidadExcepcion: {}
			};

			vm.formControl = {
				showDivInfo: false,
				showDivEdit: false,
				new: nuevaExcepcion,
				error: true,
				loading: false,
				info: viewInfo,
				agregar: false,
				edit: editarExcepcion,
				delete: borrarExcepcion,
				volver: volver,
				limpiarForm: limpiarForm,
				addEntidadExcepcion: addEntidadExcepcion,
				save: guardarUsuario,
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
				Nombre: '',
				Codigo: '',
				clean: cleanFilters,
				validar: validarFilters
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

			function nuevaExcepcion() {
				limpiarForm();

				UsuarioGestionLogicService.newExcepcion(User, vm.data.tipoEntidadesObtenidas, vm.data.usuario.Id)
					.then(newExcepcionOk, newExcepcionError);

				function newExcepcionOk(pResult) {
					$log.error('newExcepcionOk OK.-', pResult);
					activate();
				}

				function newExcepcionError(pError) {
					$log.error('newExcepcionError OK.-', pError);
				}
			}

			function editarExcepcion(excepcion) {

				limpiarForm();

				getEntidadExcepcion(excepcion.TipoEntidad)
					.then(obtenerDatosOk, obtenerDatosError);


				function obtenerDatosOk(pResults) {

					$log.debug('editarExcepcion OK.-', pResults);

					angular.forEach(vm.data.entidadExcepciones, function (entidadTodos, ind) {

						angular.forEach(excepcion.Entidades, function (value, key) {

							if (value.IdEntidad === entidadTodos.Id) {
								entidadTodos.checked = true;
							}

						});

					});

				}

				function obtenerDatosError(pError) {
					$log.debug("error", pError);
				}

				vm.formControl.showDivEdit = true;
				vm.data.usuarioAGuardar = angular.copy(vm.data.usuario);
			}

			function borrarExcepcion(excepcion) {
				limpiarForm();
				ModalService.confirm('¿Desea eliminar la Excepcion de tipo"' + excepcion.TipoEntidad.Nombre + '"?',
					function (pResult) {

						if (pResult) {

							UsuarioGestionDataService.eliminarExcepcionUsuario(excepcion.Id)
								.then(function (pResp) {
									ModalService.success("Excepcion Eliminada");
									activate();
								}).catch(function (pErr) {
									ModalService.error("Error de servidor");
									$log.error('Validacion Eliminar .-', pErr);
								});

						}
					});
				vm.formControl.showDivEdit = false;
			}

			function limpiarForm() {
				vm.formControl.showDivInfo = false;
				vm.formControl.showDivEdit = false;
			}

			function getEntidadesChecked() {

				var _ret: Array<any> = [];
				
				angular.forEach(vm.data.entidadExcepciones, function (excepcion) {

					if(excepcion.checked){

						var _excp = {
							
							IdEntidad: excepcion.Id,
							Nombre : excepcion.Nombre
						}

						_ret.push(_excp)

					}
				});

				return _ret;
			}

			function guardarUsuario() {


				$log.debug("guardar usuario vm.data.usuarioAGuardar", vm.data.usuarioAGuardar);
				$log.debug("uardar usuario vm.filter.entidadExcepciones", vm.filter.entidadExcepciones);


				if (vm.data.usuarioAGuardar.Excepciones.length !== 0) {

					vm.data.usuarioAGuardar.Excepciones.find(x => x.TipoEntidad.Id === vm.filter.entidadExcepciones[0].IdTipo).Entidades = getEntidadesChecked();

					
					var _excepcionUsuario = vm.data.usuarioAGuardar;
					$log.debug("guardar usuario _excepcionUsuario", _excepcionUsuario);
					vm.formControl.loading = true;

					UsuarioGestionDataService.newExcepcionUsuario(_excepcionUsuario)
						.then(addOk, addError);

				} else {

					ModalService.error("Debe elegir por lo menos una excepción");

				}

				function addOk(pResponse) {

					$log.debug("ValidacionNew", pResponse);

					if (pResponse.IsOk === true) {
						ModalService.success("Excepcion agregada");
						//$uibModalInstance.close("ok");
						vm.formControl.loading = false;
						$state.go('usuario.gestion.list');
					} else {
						ModalService.error(pResponse.Message);
						vm.formControl.loading = false;
					}
				}

				function addError(pError) {
					ModalService.error("Error de servidor");
					$log.error('  ERROR.-', pError);
				}
			}

			function viewInfo(excepcion) {
				vm.data.entidadExcepciones = angular.copy(excepcion.Entidades);

				limpiarForm();

				vm.formControl.showDivInfo = true;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 4;

				vm.paginacion.getPage();
			}

			function getEntidadExcepcion(pEntidadExcepcion) {
				var def = $q.defer();

				if (pEntidadExcepcion.Id != null) {
					vm.formControl.loading = true;

					var _todosPorId = UsuarioGestionDataService.obtenerTodosEntidadExcepcionPorTipo(pEntidadExcepcion.Id)
						.then(searchOk, searchError);
				}

				function searchOk(pResults) {
					//$log.debug('searchOk ON.-');
					vm.data.entidadExcepciones = pResults;
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 4;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
					cleanFilters();
					def.resolve(pResults);
				}

				function searchError(pError) {
					vm.formControl.loading = false;
					cleanFilters();
					def.reject(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
				return def.promise;
			}

			function addEntidadExcepcion(pEntidadExcepcion, checkbox) {

				$scope.formEdit.$pristine = false;

				var pEntidad = angular.copy(vm.data.nuevoEntidadExcepcion);

				pEntidad.IdEntidad = angular.copy(pEntidadExcepcion.Id);
				pEntidad.Nombre = angular.copy(pEntidadExcepcion.Nombre);

				angular.forEach(vm.data.usuarioAGuardar.Excepciones, function (value, key) {

					if (value.TipoEntidad.Id === pEntidadExcepcion.IdTipo) {

						if (checkbox === true) {
							value.Entidades.push(pEntidad);
							//vm.data.usuarioAGuardar.Excepciones[value.TipoEntidad.Id].Entidades.push(pEntidad);
						} else {

							value.Entidades = $.grep(value.Entidades, function (e: any) {
								//$log.debug('e ON.-', e);
								return e.IdEntidad != pEntidad.IdEntidad;
							});

						}

					}


				});
			}



			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.Nombre = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.sucursal == null)
					vm.filter.sucursal = '';

				if (vm.filter.estadoCama == null)
					vm.filter.estadoCama = '';

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
				vm.data.entidadExcepciones = orderByFilter(vm.data.entidadExcepciones, vm.order.value, vm.order.reverse);

				vm.filter.entidadExcepciones = $filter('filter')
					(vm.data.entidadExcepciones, {


					});

				vm.paginacion.totalItems = vm.filter.entidadExcepciones.length;
				vm.filter.entidadExcepciones = vm.filter.entidadExcepciones.slice(begin, end);

			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {

				vm.formControl.loading = true;

				vm.data.tipoEntidadesObtenidas = [];

				var _usuarioObtenido = UsuarioGestionDataService.obtenerExcepcionPorId(vm.data.usuario.Id);
				var _tipoExcepcion = UsuarioGestionDataService.obtenerTodosTipoExcepcionAcceso();
				var _tipoEntidadExcepcion = UsuarioGestionDataService.obtenerTodosTipoEntidadExcepcionAcceso();
				var _nuevoExcepcion = UsuarioGestionDataService.obtenerNuevoExcepcion();
				var _nuevoEntidadExcepcion = UsuarioGestionDataService.obtenerNuevoEntidadExcepcion();

				$q.all([
					_usuarioObtenido,
					_tipoExcepcion,
					_tipoEntidadExcepcion,
					_nuevoExcepcion,
					_nuevoEntidadExcepcion
				])
					.then(activateOk, activateError);

				function activateOk(pResults) {

					vm.formControl.loading = false;

					vm.data.usuario = pResults[0];
					vm.data.excepciones = vm.data.usuario.Excepciones;

					vm.data.tipoExcepcion = pResults[1];
					vm.data.tipoEntidadExcepcion = pResults[2];
					vm.data.nuevoExcepcion = pResults[3];
					vm.data.nuevoEntidadExcepcion = pResults[4];

					angular.forEach(vm.data.excepciones, function (value, key) {
						vm.data.tipoEntidadesObtenidas.push(value.TipoEntidad.Id);
					});

					limpiarForm();
				}

				function activateError(pError) {
					$log.error('Inicializar ERROR.-', pError);
				}
			}
		}
	};

	return module;
})();
