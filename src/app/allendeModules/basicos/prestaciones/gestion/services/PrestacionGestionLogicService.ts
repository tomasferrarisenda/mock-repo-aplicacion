/**
 * @author 			ppautasso
 * @description 	description
 */

import prestacionViewTemplate = require('../templates/prestacion-view.tpl.html');
import prestacionNewTemplate = require('../templates/prestacion-new.tpl.html');
import prestacionAsignarTemplate = require('../templates/prestacion-asignar.tpl.html');
import prestacionEditTemplate = require('../templates/prestacion-edit.tpl.html');
import prestacionBuscadorTemplate = require('../templates/buscador-prestacion.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('PrestacionGestionLogicService', PrestacionGestionLogicService);

		PrestacionGestionLogicService.$inject = ['Logger', '$q', '$uibModal', 'ModalService',
			'PrestacionGestionDataService',
			'ACTION_PRESTACION_GESTION'
		];

		function PrestacionGestionLogicService($log, $q, $uibModal, ModalService,
			PrestacionGestionDataService,
			ACTION_PRESTACION_GESTION) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionGestionLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				validarEsListAll: validarEsListAll,

				selectList: selectList,
				openPrestacion: openPrestacion,
				newPrestacion: newPrestacion,
				editPrestacion: editPrestacion,
				asignarPrestacion: asignarPrestacion,

				activarDesactivarPrestacion: activarDesactivarPrestacion,
				deleteRelacionServicio: deleteRelacionServicio,

				activarDesactivarPrestacionDelRecurso: activarDesactivarPrestacionDelRecurso,
				deleteRelacionRecurso: deleteRelacionRecurso,


				openSelectorPrestacion: openSelectorPrestacion

			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function selectList(pUser) {
				//return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_SERVICIOS.LIST)
			}

			function validarEsListAll(pActionPath) {
				if (pActionPath == ACTION_PRESTACION_GESTION.LIST_ALL) {
					return true;
				} else {
					return false;
				}
			}


			function Module() {
				return 'PRESTACION';
			}



			function openPrestacion(pIdPrestacion) {
				$log.debug('openPrestacionModal OK.-', pIdPrestacion);
				var _idPrestacionSelected;
				if (pIdPrestacion)
					_idPrestacionSelected = pIdPrestacion;
				else
					_idPrestacionSelected = null;


				//var _actions = AuthorizationService.GetActionPathsByPermission(pUser, pPermissionName);

				return $uibModal.open({
					template: prestacionViewTemplate,
					controller: 'PrestacionViewController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						// User : function () {
						// 	return pUser;
						// },
						IdPrestacionSelected: function() {
							return _idPrestacionSelected;
						},
						Title: function() {
							return 'Seleccionar acción';
						},
						// Actions : function () {
						// 	return _actions;
						// }
					}
				}).result;
			}


			function newPrestacion(idPrestacionEdit) {

				return $uibModal.open({
					template: prestacionNewTemplate,
					controller: 'PrestacionNewController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdPrestacionEdit: idPrestacionEdit
					}

				}).result;

			}

			function asignarPrestacion(pIdSucursal, pIdServicio, pUser) {
				$log.debug('asignarPrestacion OK.-');

				return $uibModal.open({
					template: prestacionAsignarTemplate,
					controller: 'PrestacionAsignarController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Asignar una prestacion';
						},
						IdSucursal: function() {
							return pIdSucursal;
						},
						IdServicio: function() {
							return pIdServicio;
						},
						Module: Module
					}

				}).result;

			}

			function editPrestacion(pIdPrestacionSelected) {

				$log.debug('editPrestacion OK.-', pIdPrestacionSelected);
				var _idPrestacionSelected;
				if (pIdPrestacionSelected)
					_idPrestacionSelected = pIdPrestacionSelected;
				else
					_idPrestacionSelected = null;

				return $uibModal.open({
					template: prestacionEditTemplate,
					controller: 'PrestacionEditController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdPrestacionSelected: function() {
							return _idPrestacionSelected;
						},
						Module: Module
					}

				}).result;
			}

			function deleteRelacionServicio(pPrestacion) {

				var def = $q.defer();

				ModalService.confirm('¿Desea eliminar la prestacion ' + pPrestacion.Nombre + ' del servicio?',
					function(pResult) {

						if (pResult) {

							PrestacionGestionDataService.validarEliminarXServicio(pPrestacion.Id)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {

										PrestacionGestionDataService.eliminarXServicio(pPrestacion.Id)
											.then(function(pResp) {
												ModalService.success("Prestacion Eliminada del Servicio");
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

			function deleteRelacionRecurso(pPrestacion) {

				var def = $q.defer();

				ModalService.confirm('¿Desea eliminar la prestacion ' + pPrestacion.Nombre + ' del Recurso?',
					function(pResult) {

						if (pResult) {

							PrestacionGestionDataService.validarEliminarDelRecurso(pPrestacion.Id)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {

										PrestacionGestionDataService.eliminarDelRecurso(pPrestacion.Id)
											.then(function(pResp) {
												ModalService.success("Prestacion Eliminada del Recurso");
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



			function activarDesactivarPrestacion(pPrestacion) {


				var def = $q.defer();

				var accion : any= null;

				$log.debug('Activar/desactivar : ');

				if (pPrestacion.Activo === true) {

					accion = "desactivar";

				} else if (pPrestacion.Activo === false) {

					accion = "activar";

				}

				ModalService.confirm('¿Desea ' + accion + ' la prestacion ' + pPrestacion.Nombre + ' del servicio?',
					function(pResult) {
						if (pResult) {


							if (pPrestacion.Activo === true) {

								PrestacionGestionDataService.validarDesactivar(pPrestacion.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											PrestacionGestionDataService.desactivar(pPrestacion.Id)
												.then(function(pResp) {
													ModalService.success("Prestacion Desactivada");
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

							if (pPrestacion.Activo === false) {

								PrestacionGestionDataService.validarActivar(pPrestacion.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											PrestacionGestionDataService.activar(pPrestacion.Id)
												.then(function(pResp) {
													ModalService.success("Prestacion Activada");
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


			function activarDesactivarPrestacionDelRecurso(pPrestacion) {


				var def = $q.defer();

				var accion : any= null;

				$log.debug('Activar/desactivar : ');

				if (pPrestacion.Activo === true) {

					accion = "desactivar";

				} else if (pPrestacion.Activo === false) {

					accion = "activar";

				}

				ModalService.confirm('¿Desea ' + accion + ' la prestacion ' + pPrestacion.Nombre + ' del Recurso?',
					function(pResult) {
						if (pResult) {


							if (pPrestacion.Activo === true) {

								PrestacionGestionDataService.validarDesactivarDelRecurso(pPrestacion.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											PrestacionGestionDataService.desactivarDelRecurso(pPrestacion.Id)
												.then(function(pResp) {
													ModalService.success("Prestacion Desactivada");
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

							if (pPrestacion.Activo === false) {

								PrestacionGestionDataService.validarActivarDelRecurso(pPrestacion.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											PrestacionGestionDataService.activarDelRecurso(pPrestacion.Id)
												.then(function(pResp) {
													ModalService.success("Prestacion Activada");
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



			function openSelectorPrestacion() {

				 return $uibModal.open({
					template: prestacionBuscadorTemplate,
					keyboard: true,
                    size: 'lg',
                    resolve: {
                       // IdServicio: function () {
                       //      return idServicio;
                       //  }
                    }
                }).result;
				

			}

		}
	};

	return module;

})();