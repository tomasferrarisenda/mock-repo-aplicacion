/**
 * @author 			ppautasso
 * @description 	description
 */

import usuarioView = require('../templates/usuario-view.tpl.html');
import usuarioNew = require('../templates/usuario-new.tpl.html');
import usuarioEdit = require('../templates/usuario-edit.tpl.html');
import asignarRol = require('../templates/usuario-asignar-rol.tpl.html');
import nuevaExcepcion = require('../templates/excepcion-new.tpl.html');


export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('UsuarioGestionLogicService', UsuarioGestionLogicService);

		UsuarioGestionLogicService.$inject = ['Logger', '$q', '$uibModal', 'ModalService',
			'AuthorizationService', 'UsuarioGestionDataService',
			'ACTION_USUARIO'
		];

		function UsuarioGestionLogicService($log, $q, $uibModal, ModalService,
			AuthorizationService, UsuarioGestionDataService,
			ACTION_USUARIO) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('UsuarioGestionLogicService');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				validarEsListAll: validarEsListAll,

				selectList: selectList,
				openUsuario: openUsuario,
				// newUsuario: newUsuario,
				editUsuario: editUsuario,
				deleteUsuario: deleteUsuario,
				newExcepcion: newExcepcion,
				//openAsignarExcepcion: openAsignarExcepcion,		
				asignarRol: asignarRol,
				verUsuariosACargo: verUsuariosACargo
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function selectList(pUser) {
				//return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_SERVICIOS.LIST)
			}

			function validarEsListAll(pActionPath) {
				if (pActionPath == ACTION_USUARIO.LIST_ALL) {
					return true;
				} else {
					return false;
				}
			}

			function Module() {
				return 'USUARIOS';
			}

			function openUsuario(pIdUsuario) {
				//$log.debug('openUsuario OK.-', pIdUsuario);
				var _idUsuarioSelected;
				if (pIdUsuario)
					_idUsuarioSelected = pIdUsuario;
				else
					_idUsuarioSelected = null;

				return $uibModal.open({
					template: usuarioView,
					controller: 'UsuarioViewController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdUsuarioSelected: function () {
							return _idUsuarioSelected;
						},
						// User: function () {
						// 	return pUser;
						// },
						Title: function () {
							return 'Seleccionar un usuario';
						}
					}

				}).result;
			}

			// function newUsuario(pUser) {
			// 	return $uibModal.open({
			// 		template: usuarioNew,
			// 		controller: 'UsuarioNewController',
			// 		controllerAs: 'vm',
			// 		size: 'lg',
			// 		resolve: {
			// 			// User: function () {
			// 			// 	return pUser;
			// 			// },
			// 			Title: function () {
			// 				return 'Agregar un usuario';
			// 			}
			// 		}
			// 	}).result;
			// }

			function editUsuario(pIdUsuario) {

				$log.debug('editUsuario OK.-', pIdUsuario);
				var _idUsuarioSelected;
				if (pIdUsuario)
					_idUsuarioSelected = pIdUsuario;
				else
					_idUsuarioSelected = null;

				return $uibModal.open({
					template: usuarioEdit,
					controller: 'UsuarioEditController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdUsuarioSelected: function () {
							return _idUsuarioSelected;
						},
						// User: function () {
						// 	return pUser;
						// },
						Title: function () {
							return 'Editar un usuario';
						}
					}

				}).result;
			}


			function deleteUsuario(pUsuario) {
				var def = $q.defer();
				ModalService.confirm('¿Desea eliminar el Usuario "' + pUsuario.Nombre + '"?',
					function (pResult) {

						if (pResult) {

							UsuarioGestionDataService.eliminar(pUsuario.Id)
								.then(function (pResponse) {

									if (pResponse.IsOk === true) {
										ModalService.success("Usuario Eliminado");
										def.resolve(pResponse);
									} else {
										ModalService.error(pResponse.Message);
										def.reject(pResponse.Message);
									}
								})
								.catch(function (pError) {
									$log.error('Validacion Eliminar .-', pError);
									def.reject(pError);
								});

						}
					});

				return def.promise;
			}



			function asignarRol(pIdUsuario) {

				$log.debug('asignarRol OK.-', pIdUsuario);
				var _idUsuarioSelected;
				if (pIdUsuario)
					_idUsuarioSelected = pIdUsuario;
				else
					_idUsuarioSelected = null;

				return $uibModal.open({
					template: asignarRol,
					controller: 'UsuarioAsignarRolController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdUsuarioSelected: function () {
							return pIdUsuario;
						},
						// User: function () {
						// 	return pUser;
						// },
						Title: function () {
							return 'Asignar un rol a un usuario';
						}
					}
				}).result;
			}

			function newExcepcion(pUser, tipoEntidadesObtenidas, usuarioId) {
				return $uibModal.open({
					template: nuevaExcepcion,
					controller: 'ExcepcionNewController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						UsuarioId: function () {
							return usuarioId;
						},
						IdsTipoEntidadesObtenidas: function () {
							return tipoEntidadesObtenidas;
						},
						Title: function () {
							return 'Agregar una Excepcion';
						}
					}
				}).result;
			}

			function verUsuariosACargo(usuario) {
				return $uibModal.open({
					component: 'saVerUsuariosACargo',
					size: 'lg',
					keyboard: true,
					resolve: {
						Usuario: () => {
							return usuario;
						}
					}
				}).result;
			}

		}

	}
	return module;
})();
