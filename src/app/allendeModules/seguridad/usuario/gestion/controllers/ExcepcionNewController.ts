/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('ExcepcionNewController', ExcepcionNewController);

		// Inyección de Dependencia
		ExcepcionNewController.$inject = ['$scope', 'Logger', '$filter', '$q', '$uibModalInstance', 'orderByFilter',
			'ModalService',
			'UsuarioGestionDataService',
			'IdsTipoEntidadesObtenidas',
			'UsuarioId'
		];

		// Constructor del Controller
		function ExcepcionNewController($scope, $log, $filter, $q, $uibModalInstance, orderByFilter,
			ModalService,
			UsuarioGestionDataService,
			IdsTipoEntidadesObtenidas,
			UsuarioId

		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ExcepcionNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;


			vm.data = {
				idsTipoEntidadesObtenidas: IdsTipoEntidadesObtenidas,
				tipoEntidadExcepcion: {},
				entidadExcepciones: {},
				tipoExcepcion: {},
				nuevoEntidadExcepcion: {},
				usuarioId: UsuarioId

			};

			vm.formControl = {
				ok: guardarExcepcion,
				cancel: cancel,
				error: true,
				loading: false,
				getEntidadExcepcion: getEntidadExcepcion,
				addEntidadExcepcion: addEntidadExcepcion,


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

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}



			function inicializarVariables() {
				vm.formControl.esEdit = false;
				vm.formControl.esNew = false;
			}



			function getEntidadExcepcion(pEntidadExcepcion) {
				var def = $q.defer();

				if (pEntidadExcepcion.Id != null) {
					vm.formControl.loading = true;
					var _todosPorId = UsuarioGestionDataService.obtenerTodosEntidadExcepcionPorTipo(pEntidadExcepcion.Id)
						.then(searchOk, searchError);
				}

				function searchOk(pResults) {
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
			
			function getSomeExcepcionChecked() {

				var _ret = false
			
				angular.forEach(vm.data.entidadExcepciones, function (excepcion) {

					if (excepcion.checked) {
						_ret = true;

					}
				});
				return _ret;
			}
			
			function getEntidadesChecked() {

				var _ret: Array<any> = [];

				angular.forEach(vm.data.entidadExcepciones, function (excepcion) {

					if (excepcion.checked) {

						var _excp = {

							IdEntidad: excepcion.Id,
							Nombre: excepcion.Nombre
						}

						_ret.push(_excp)

					}
				});

				return _ret;
			}

			function guardarExcepcion() {

				vm.data.usuarioAGuardar.TipoEntidad = angular.copy(vm.data.tipoEntidadExcepcion.Nombre);
				vm.data.usuarioAGuardar.TipoExcepcion = angular.copy(vm.data.tipoExcepcion.Nombre);
				vm.data.usuarioAGuardar.IdUsuario = angular.copy(vm.data.usuarioId);

				if (getSomeExcepcionChecked() || vm.data.usuarioAGuardar.TipoExcepcion.Id === 1) {

					vm.data.usuarioAGuardar.Entidades = getEntidadesChecked();

					var _excepcionUsuario = vm.data.usuarioAGuardar;
					vm.formControl.loading = true;

					UsuarioGestionDataService.guardarExcepcionDelUsuario(_excepcionUsuario)
						.then(addOk, addError);

				} else {

					ModalService.error("Debe elegir por lo menos una excepción");

				}

				function addOk(pResponse) {
						if (pResponse.IsOk === true) {
							ModalService.success("Excepcion agregada");
							$uibModalInstance.close("ok");
							vm.formControl.loading = false;
							activate();
						} else {
							ModalService.error(pResponse.Message);
							vm.formControl.loading = false;
						}

						vm.formControl.loading = false;
					}

					function addError(pError) {
						ModalService.error("Error de servidor");
						$uibModalInstance.dismiss(pError);
					}
			
			}



			function addEntidadExcepcion(pEntidadExcepcion, checkbox) {

				var pEntidad = angular.copy(vm.data.nuevoEntidadExcepcion);
		
				vm.data.usuarioAGuardar.TipoEntidad = angular.copy(vm.data.tipoEntidadExcepcion.Nombre);
				vm.data.usuarioAGuardar.TipoExcepcion = angular.copy(vm.data.tipoExcepcion.Nombre);
				vm.data.usuarioAGuardar.IdUsuario = angular.copy(vm.data.usuarioId);

				pEntidad.IdEntidad = angular.copy(pEntidadExcepcion.Id);
				pEntidad.Nombre = angular.copy(pEntidadExcepcion.Nombre);


				if (checkbox === true) {
					vm.data.usuarioAGuardar.Entidades.push(pEntidad);
					//vm.data.usuarioAGuardar.Excepciones[value.TipoEntidad.Id].Entidades.push(pEntidad);
				} else {

					vm.data.usuarioAGuardar.Entidades = $.grep(vm.data.usuarioAGuardar.Entidades, function(e : any) {
						//$log.debug('e ON.-', e);
						return e.IdEntidad != pEntidad.IdEntidad;
					});

				}
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				$log.debug('cleanFilters -');

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
						Nombre: vm.filter.Nombre

					});

				vm.paginacion.totalItems = vm.filter.entidadExcepciones.length;
				vm.filter.entidadExcepciones = vm.filter.entidadExcepciones.slice(begin, end);
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				vm.formControl.loading = true;
				
				var _tipoEntidadExcepcion = UsuarioGestionDataService.obtenerTodosTipoEntidadExcepcionAcceso();
				var _tipoExcepcion = UsuarioGestionDataService.obtenerTodosTipoExcepcionAcceso();
				var _nuevoEntidadExcepcion = UsuarioGestionDataService.obtenerNuevoEntidadExcepcion();
				var _nuevoExcepcion = UsuarioGestionDataService.obtenerNuevoExcepcion();


				$q.all([
						_tipoEntidadExcepcion,
						_tipoExcepcion,
						_nuevoEntidadExcepcion,
						_nuevoExcepcion
					])
					.then(activateOk, activateError);

				function activateOk(pResults) {

					vm.formControl.loading = false;

					vm.data.tipoEntidadExcepcion = pResults[0];
					vm.data.tipoExcepcion = pResults[1];
					vm.data.nuevoEntidadExcepcion = pResults[2];
					vm.data.nuevoExcepcion = pResults[3];

					angular.forEach(vm.data.idsTipoEntidadesObtenidas, function(value, key) {


						vm.data.tipoEntidadExcepcion = $.grep(vm.data.tipoEntidadExcepcion, function(e : any) {
							return e.Id != value;
						});

					});
					vm.data.usuarioAGuardar = angular.copy(vm.data.nuevoExcepcion);
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
