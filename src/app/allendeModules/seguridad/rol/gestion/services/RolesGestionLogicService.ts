/**
 * @author 			ppautasso
 * @description 	description
 */

import rolesNewView = require('../templates/roles-new.tpl.html');
import rolesEditView = require('../templates/roles-edit.tpl.html');

export default (function () {
   'use strict';


	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('RolesGestionLogicService', RolesGestionLogicService);

		RolesGestionLogicService.$inject = ['Logger','$q', '$uibModal', 'ModalService', 'RolesGestionDataService',
			'AuthorizationService', 
			'ACTION_ROLES'
		];
		
		function RolesGestionLogicService ($log,$q, $uibModal, ModalService, RolesGestionDataService,
			AuthorizationService, 
			ACTION_ROLES) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RolesGestionLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				validarEsListAll : validarEsListAll,

				selectList : selectList,
				newRol : newRol,
				editRol : editRol,
				deleteRol : deleteRol
				
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

		
			function selectList (pUser) {
				//return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_SERVICIOS.LIST)
			}

			function validarEsListAll (pActionPath) {
				if(pActionPath == ACTION_ROLES.LIST_ALL) {
					return true;
				} else {
					return false;
				}
			}

	
			function Module () {
				return 'ROLES';
			}

		

		


			function newRol (pUser){
				$log.debug('newRol OK.-');
		
				return $uibModal.open({
					template : rolesNewView,
					controller: 'RolesNewController',
					controllerAs : 'vm',
					keyboard : true,
					size: 'lg',
					resolve: {
						// User: function () {
						// 	return pUser;
						// },
						Title : function () {
							return 'Agregar nuevo Rol';
						},
						Module : Module
					}

				}).result;

			}

			function editRol (pIdRolSelected){

				$log.debug('editPrestacion OK.-', pIdRolSelected);
				var _idRolSelected;
				if (pIdRolSelected)
					_idRolSelected = pIdRolSelected;
				else
					_idRolSelected = null;
		
				return $uibModal.open({
					template : rolesEditView,
					controller: 'RolesEditController',
					controllerAs : 'vm',
					keyboard : true,
					size: 'lg',
					resolve: {
						IdRolSelected: function () {
							return _idRolSelected;
						},
						// User: function () {
						// 	return pUser;
						// },
						Title : function () {
							return 'Editar un rol';
						},
						Module : Module
					}

				}).result;
			}

			function deleteRol(pRol) {


				var def = $q.defer();

				ModalService.confirm('¿Desea eliminar el Rol "' + pRol.Nombre + '" con sus Permisos?',
					function(pResult) {

						if (pResult) {

							RolesGestionDataService.validarEliminar(pRol.Id)
								.then(function(pResponse) {

									if (pResponse.IsOk === true) {

										RolesGestionDataService.eliminar(pRol.Id)
											.then(function(pResp) {
												ModalService.success("Rol Eliminado");
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

		}
	};

	return module;
   
})();