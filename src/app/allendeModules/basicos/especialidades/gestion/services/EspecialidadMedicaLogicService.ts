/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('EspecialidadMedicaLogicService', EspecialidadMedicaLogicService);

		EspecialidadMedicaLogicService.$inject = ['Logger', '$q', '$uibModal', 'ModalService',
			'EspecialidadMedicaDataService',
			'ACTION_SERVICIOS_ESPECIALIDAD'
		];

		function EspecialidadMedicaLogicService($log, $q, $uibModal, ModalService,
			EspecialidadMedicaDataService,
			ACTION_SERVICIOS_ESPECIALIDAD) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EspecialidadMedicaLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				validarEsListAll: validarEsListAll,

				selectList: selectList,
				open: openEspecialidad,
				new: newEspecialidad,
				edit: editEspecialidad,
				asignar: asignarEspecialidad,
				activarDesactivar: activarDesactivar,
				deleteRelacionServicio: deleteRelacionServicio,

				activarDesactivarDelRecurso: activarDesactivarDelRecurso,
				deleteRelacionRecurso: deleteRelacionRecurso

			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function selectList(pUser) {
				//return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_SERVICIOS.LIST)
			}

			function validarEsListAll(pActionPath) {
				if (pActionPath == ACTION_SERVICIOS_ESPECIALIDAD.LIST_ALL) {
					return true;
				} else {
					return false;
				}
			}


			function Module() {
				return 'ESPECIALIDAD MEDICA';
			}



			function openEspecialidad(pIdEspecialidad) {
				$log.debug('openEspecialidadModal OK.-', pIdEspecialidad);
				var _idEspecialidadSelected;
				if (pIdEspecialidad)
					_idEspecialidadSelected = pIdEspecialidad;
				else
					_idEspecialidadSelected = null;

				return $uibModal.open({
					templateUrl: 'basicos/servicios/especialidadMedica/templates/especialidad-view.tpl.html',
					controller: 'EspecialidadViewController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdEspecialidadSelected: function() {
							return _idEspecialidadSelected;
						},
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Seleccionar un servicio';
						},
						Module: Module
					}

				}).result;
			}


			function newEspecialidad(pUser) {
				$log.debug('newServicio OK.-');

				return $uibModal.open({
					templateUrl: 'basicos/servicios/gestion/templates/servicio-new.tpl.html',
					controller: 'ServicioNewController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Agregar un servicio';
						},
						Module: Module
					}

				}).result;

			}

			function editEspecialidad(pIdServicioSelected) {

				$log.debug('editServicio OK.-', pIdServicioSelected);
				var _idServicioSelected;
				if (pIdServicioSelected)
					_idServicioSelected = pIdServicioSelected;
				else
					_idServicioSelected = null;

				return $uibModal.open({
					templateUrl: 'basicos/servicios/gestion/templates/servicio-edit.tpl.html',
					controller: 'ServicioEditController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						IdServicioSelected: function() {
							return _idServicioSelected;
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


			function asignarEspecialidad(pIdSucursal, pIdServicio, pUser) {
				$log.debug('asignarEspecialidad OK.-');

				return $uibModal.open({
					templateUrl: 'basicos/servicios/especialidadMedica/templates/especialidad-asignar.tpl.html',
					controller: 'EspecialidadAsignarController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title: function() {
							return 'Asignar una especialidad';
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


			function deleteRelacionServicio(pEspecialidad) {

				var def = $q.defer();

				ModalService.confirm('¿Desea eliminar la especialidad ' + pEspecialidad.Nombre + ' del servicio?',
					function(pResult) {

						if (pResult) {

							EspecialidadMedicaDataService.validarEliminarXServicio(pEspecialidad.Id)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {

										EspecialidadMedicaDataService.eliminarXServicio(pEspecialidad.Id)
											.then(function(pResp) {
												ModalService.success("Especialidad Eliminada del Servicio");
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


			function deleteRelacionRecurso(pEspecialidad) {

				var def = $q.defer();

				ModalService.confirm('¿Desea eliminar la Especialidad ' + pEspecialidad.Nombre + ' del Recurso?',
					function(pResult) {

						if (pResult) {

							EspecialidadMedicaDataService.validarEliminarDelRecurso(pEspecialidad.Id)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {

										EspecialidadMedicaDataService.eliminarDelRecurso(pEspecialidad.Id)
											.then(function(pResp) {
												ModalService.success("Especialidad Eliminada del Recurso");
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


			function activarDesactivar(pEspecialidad) {

				var def = $q.defer();

				var accion : any = null;

				$log.debug('Activar/desactivar : ');

				if (pEspecialidad.Activo === true) {

					accion = "desactivar";

				} else if (pEspecialidad.Activo === false) {

					accion = "activar";

				}

				ModalService.confirm('¿Desea ' + accion + ' la especialidad ' + pEspecialidad.Nombre + ' del servicio?',
					function(pResult) {
						if (pResult) {


							if (pEspecialidad.Activo === true) {

								EspecialidadMedicaDataService.validarDesactivar(pEspecialidad.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											EspecialidadMedicaDataService.desactivar(pEspecialidad.Id)
												.then(function(pResp) {
													ModalService.success("Especialidad Desactivada");
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

							if (pEspecialidad.Activo === false) {

								EspecialidadMedicaDataService.validarActivar(pEspecialidad.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											EspecialidadMedicaDataService.activar(pEspecialidad.Id)
												.then(function(pResp) {
													ModalService.success("Especialidad Activada");
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



			function activarDesactivarDelRecurso(pEspecialidad) {


				var def = $q.defer();

				var accion : any = null;

				$log.debug('Activar/desactivar : ');

				if (pEspecialidad.Activo === true) {

					accion = "desactivar";

				} else if (pEspecialidad.Activo === false) {

					accion = "activar";

				}

				ModalService.confirm('¿Desea ' + accion + ' la especialidad ' + pEspecialidad.Nombre + ' del Recurso?',
					function(pResult) {
						if (pResult) {


							if (pEspecialidad.Activo === true) {

								EspecialidadMedicaDataService.validarDesactivarDelRecurso(pEspecialidad.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											EspecialidadMedicaDataService.desactivarDelRecurso(pEspecialidad.Id)
												.then(function(pResp) {
													ModalService.success("Especialidad Desactivada");
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

							if (pEspecialidad.Activo === false) {

								EspecialidadMedicaDataService.validarActivarDelRecurso(pEspecialidad.Id)
									.then(function(pResponse) {

										if (pResponse.IsOk === true) {

											EspecialidadMedicaDataService.activarDelRecurso(pEspecialidad.Id)
												.then(function(pResp) {
													ModalService.success("Especialidad Activada");
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

		}
	};

	return module;

})();