/**
 * @author 			ppautasso
 * @description 	description
 */


import recursoAsignarTemplate = require('../templates/recurso-add-relaciones.tpl.html');


export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('RecursosLogicService', RecursosLogicService);

		RecursosLogicService.$inject = ['Logger', '$q', '$uibModal', 'ModalService',
			'RecursosDataService', 'AuthorizationService'
		];

		function RecursosLogicService($log, $q, $uibModal, ModalService,
			RecursosDataService, AuthorizationService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RecursosLogicServiceº');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				//	validarEsListAll : validarEsListAll,

				selectList: selectList,
				new: nuevoRecurso,
				open: openRecurso,
				edit: editRecurso,
				asignar: asignarRecurso,
				activarDesactivar: activarDesactivar,

				deleteRelacionServicio: deleteRelacionServicio,

				viewRelaciones: viewRelaciones,

				addRelaciones: addRelaciones

			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function selectList(pUser) {
				//return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_SERVICIOS.LIST)
			}

			// function validarEsListAll (pActionPath) {
			// 	if(pActionPath == ACTION_PRESTACION_GESTION.LIST_ALL) {
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// }


			function Module() {
				return 'RECURSOS';
			}

			function nuevoRecurso() {
				// body...
				// 
			}

			function openRecurso(pIdPrestacion) {
				$log.debug('openPrestacionModal OK.-', pIdPrestacion);
				var _idPrestacionSelected;
				if (pIdPrestacion)
					_idPrestacionSelected = pIdPrestacion;
				else
					_idPrestacionSelected = null;

				var _actions = AuthorizationService.GetActionPathsByPermission();

				return $uibModal.open({
					templateUrl: 'dist/app/core/security/templates/action-list-selector.tpl.html',
					controller: 'ActionListSelectorController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						// User: function() {
						// 	return pUser;
						// },
						Title: function() {
							return 'Seleccionar acción';
						},
						Actions: function() {
							return _actions;
						}
					}
				}).result;
			}


			function newRecurso(pUser) {
				$log.debug('newPrestacion OK.-');

				return $uibModal.open({
					templateUrl: 'basicos/servicios/prestacion/templates/prestacion-new.tpl.html',
					controller: 'PrestacionNewController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Agregar un prestacion';
						},
						Module: Module
					}

				}).result;

			}

			function editRecurso(pIdPrestacionSelected) {

				$log.debug('editPrestacion OK.-', pIdPrestacionSelected);
				var _idPrestacionSelected;
				if (pIdPrestacionSelected)
					_idPrestacionSelected = pIdPrestacionSelected;
				else
					_idPrestacionSelected = null;

				return $uibModal.open({
					templateUrl: 'basicos/servicios/prestacion/templates/prestacion-edit.tpl.html',
					controller: 'PrestacionEditController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdPrestacionSelected: function() {
							return _idPrestacionSelected;
						},
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Seleccionar una cama';
						},
						Module: Module
					}

				}).result;
			}


			function asignarRecurso(pIdSucursal, pIdServicio) {
				$log.debug('asignarRecurso OK.-');

				return $uibModal.open({
					template: recursoAsignarTemplate,
					controller: 'RecursoAsignarController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Asignar un recurso';
						},
						IdSucursal: function() {
							return pIdSucursal;
						},
						IdServicio: function() {
							return pIdServicio;
						}
					}

				}).result;

			}


			function deleteRelacionServicio(pRecurso) {

				var def = $q.defer();

				ModalService.confirm('¿Desea eliminar el recurso ' + pRecurso.Nombre + ' del servicio?',
					function(pResult) {

						if (pResult) {

							RecursosDataService.validarEliminarXServicio(pRecurso.Id)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {

										RecursosDataService.eliminarXServicio(pRecurso.Id)
											.then(function(pResp) {
												ModalService.success("Recurso Eliminado del Servicio");
												def.resolve(pResp);
											}).catch(function(pErr) {
												ModalService.error("Error de servidor");
												$log.error('Validacion Eliminar .-', pErr);
												def.reject(pErr);
											});
									} else {
										if (pResponse.Message !== null)
											ModalService.error(pResponse.Message);
										else
											ModalService.error("Error de servidor");
										def.reject(pResponse.Message);

									}
								})
								.catch(function(pError) {
									$log.error('Validacion Eliminar .-', pError);
									def.reject(pError);
								});

						}
					});

				return def.promise;


			}

			function activarDesactivar(pRecurso) {

				var def = $q.defer();

				var accion : any = null;

				$log.debug('Activar/desactivar : ');

				if (pRecurso.Activo === true) {

					accion = "desactivar";

				} else if (pRecurso.Activo === false) {

					accion = "activar";

				}

				ModalService.confirm('¿Desea ' + accion + ' el recurso ' + pRecurso.Nombre + ' del servicio?',
					function(pResult) {
						if (pResult) {


							if (pRecurso.Activo === true) {

								RecursosDataService.validarDesactivar(pRecurso.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											RecursosDataService.desactivar(pRecurso.Id)
												.then(function(pResp) {
													ModalService.success("Recurso Desactivado");
													def.resolve(pResp);
												}).catch(function(pErr) {
													ModalService.error("Error de servidor");
													$log.error('Validacion Desactivar .-', pErr);
													def.reject(pErr);
												});
										} else {
											if (pResponse.Message !== null)
												ModalService.error(pResponse.Message);
											else
												ModalService.error("Error de servidor");
											def.reject(pResponse.Message);

										}
									})
									.catch(function(pError) {
										$log.error('Validacion Desactivar .-', pError);
										def.reject(pError);
									});

							}

							if (pRecurso.Activo === false) {

								RecursosDataService.validarActivar(pRecurso.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											RecursosDataService.activar(pRecurso.Id)
												.then(function(pResp) {
													ModalService.success("Recurso Activado");
													def.resolve(pResp);
												}).catch(function(pErr) {
													ModalService.error("Error de servidor");
													$log.error('Validacion Activar .-', pErr);
													def.reject(pErr);
												});
										} else {
											if (pResponse.Message !== null)
												ModalService.error(pResponse.Message);
											else
												ModalService.error("Error de servidor");
											def.reject(pResponse.Message);

										}
									})
									.catch(function(pError) {
										$log.error('Validacion Activar .-', pError);
										def.reject(pError);
									});

							}

						}
					});

				return def.promise;

			}



			function viewRelaciones(pRecurso) {

				var _recursoXServicio;
				if (pRecurso)
					_recursoXServicio = pRecurso;
				else
					_recursoXServicio = null;

				return $uibModal.open({
					templateUrl: 'basicos/servicios/recursos/templates/recurso-view-relaciones.tpl.html',
					controller: 'RecursoViewRelaciones',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Asignar un recurso';
						},
						RecursoXServicio: function() {
							return _recursoXServicio;
						},
						// IdServicio: function() {
						// 	return pIdServicio;
						// },
						Module: Module
					}

				}).result;

			}


			function addRelaciones(pRecurso, idSucursal,idServicio,viewSelector) {


				var _recursoXServicio;
				if (pRecurso)
					_recursoXServicio = pRecurso;
				else
					_recursoXServicio = null;

				return $uibModal.open({
					templateUrl: 'basicos/servicios/recursos/templates/recurso-add-relaciones.tpl.html',
					controller: 'RecursoAddRelaciones',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Asignar un recurso';
						},
						RecursoXServicio: function() {
							return _recursoXServicio;
						},
						IdSucursal: function() {
							return idSucursal;
						},
						IdServicio: function() {
							return idServicio;
						},
						ViewSelector: function() {
							return viewSelector;
						},
						Module: Module
					}

				}).result;

			}

		}
	};

	return module;

})();