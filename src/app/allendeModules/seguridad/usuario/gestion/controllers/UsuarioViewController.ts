/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';


export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('UsuarioViewController', UsuarioViewController);

		// Inyección de Dependencia
		UsuarioViewController.$inject = ['$scope', 'Logger','$filter', '$q', '$uibModalInstance', 'orderByFilter',
			'UsuarioGestionDataService', 'ModalService',
			'UsuarioGestionLogicService',
			'ModulosPermisoDataService', 'IdUsuarioSelected'
		];

		// Constructor del Controller
		function UsuarioViewController($scope, $log, $filter, $q, $uibModalInstance, orderByFilter,
			UsuarioGestionDataService, ModalService,
			UsuarioGestionLogicService,
			ModulosPermisoDataService, IdUsuarioSelected
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioViewController');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;


			vm.data = {
				idUsuarioSelected: IdUsuarioSelected,
				usuario: {},
				rolesXPermiso: []
			};

			vm.formControl = {
				ok: guardarUsuario,
				cancel: cancel,
				error: true,
				loading: false

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
			
			function guardarUsuario() {

			
				// $log.debug(' guardarUsuario OK-',vm.data.usuario);
				// vm.data.usuario.Legajo = vm.data.LegajoEmpty;
				// var _usuario = vm.data.usuario

				// vm.formControl.loading = true;

				// UsuarioGestionDataService.validarGuardar(_usuario)
				// 	.then(addOk, addError);

				// function addOk(pResponse) {

				// 	$log.debug("ValidacionNew", pResponse);

				// 	if (pResponse.IsOk === true) {
				// 		vm.formControl.loading = true;
				// 		UsuarioGestionDataService.guardar(_usuario)
				// 			.then(function(pResp) {
								
				// 				$uibModalInstance.close("result ok");
				// 				ModalService.success("Usuario Editado");
				// 			}).catch(function(pErr) {
				// 				$uibModalInstance.dismiss(pErr);
				// 				vm.formControl.loading = false;
				// 				ModalService.error("Error de servidor");
				// 				$log.error('ValidacionNew .-', pErr);
				// 			});
				// 	} else {
				// 		if (pResponse.Message != null)
				// 			ModalService.error(pResponse.Message);
				// 		else
				// 			ModalService.error("Error de servidor");
				// 		vm.formControl.loading = false;
				// 	}

				// 	vm.formControl.loading = false;
				// }

				// function addError(pError) {
				// 	ModalService.error(pError.Message);
				// 	$uibModalInstance.dismiss(pError);
				// 	$log.error(' guardarUsuario ERROR.-', pError);
				// }
				
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

				vm.data.permisosUsuario = orderByFilter(vm.data.permisosUsuario, vm.order.value, vm.order.reverse);

				vm.filter.permisosUsuario = $filter('filter')
					(vm.data.permisosUsuario, {
						Nombre: vm.filter.nombrePermiso
					});

				vm.paginacion.totalItems = vm.filter.permisosUsuario.length;
				vm.filter.permisosUsuario = vm.filter.permisosUsuario.slice(begin, end);


			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				
				$log.debug('Inicializar UsuarioViewController ON.-');
				  vm.formControl.loading = true;

				var _usuarioObtenido = UsuarioGestionDataService.getUsuarioById(vm.data.idUsuarioSelected);
				var _usuarioObtenidoPermisosRoles = UsuarioGestionDataService.
				getUsuarioByIdParaVista(vm.data.idUsuarioSelected);

				$q.all([
						_usuarioObtenido,
						_usuarioObtenidoPermisosRoles
					])
					.then(activateOk, activateError);

				function activateOk(pResults) {

				 	vm.formControl.loading = false;

					vm.data.usuario = pResults[0];
					vm.data.usuarioParaVistas = pResults[1];
					vm.data.permisosUsuario = vm.data.usuarioParaVistas.Permisos;
					vm.data.excepciones = vm.data.usuarioParaVistas.Excepciones;

					setearExcepciones();

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 6;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
					cleanFilters();
					
					$log.debug('Inicializar OK.-',pResults);

				}

				function activateError(pError) {

					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}

				//inicializarVariables();
			}
			

			function setearExcepciones() {
				
				angular.forEach(vm.data.excepciones, function (excepcion) {
					
					

				})
			}

		}
	};

	return module;
})();
