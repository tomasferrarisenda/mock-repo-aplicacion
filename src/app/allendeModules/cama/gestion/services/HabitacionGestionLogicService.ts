/**
 * @author 			ppautasso
 * @description 	description
 */
import selectAllTemplate = require('../templates/select-all-cama.tpl.html');
import habitacionNewTemplate = require('../templates/habitacion-new.tpl.html');
import habitacionEditTemplate = require('../templates/habitacion-edit.tpl.html');
import camaNewTemplate = require('../templates/cama-new.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('HabitacionGestionLogicService', HabitacionGestionLogicService);

		HabitacionGestionLogicService.$inject = ['Logger', '$uibModal', 'AuthorizationService', 'ACTION_CAMA_GESTION'];
		
		function HabitacionGestionLogicService ($log, $uibModal, AuthorizationService, ACTION_CAMA_GESTION) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('HabitacionGestionLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

				validarEsListAll : validarEsListAll,

				// selectList : selectList,
				openCamas : openCamas,
				newHabitacion : newHabitacion,
				editHabitacion : editHabitacion,
				addCama: addCama
				
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
		
			// function selectList (pUser) {
			// 	return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_CAMA.LIST);
			// }

			function validarEsListAll (pActionPath) {
				if(pActionPath == ACTION_CAMA_GESTION.LIST_ALL) {
					return true;
				} else {
					return false;
				}
			}

	
			function Module () {
				return 'HABITACION';
			}

			function openCamas (pIdHabitacionSelected,pUser){
				$log.debug('opencamasmodal OK.-', pIdHabitacionSelected);
				var _idHabitacionSelected;
				if (pIdHabitacionSelected)
					_idHabitacionSelected = pIdHabitacionSelected;
				else
					_idHabitacionSelected = null;

				return $uibModal.open({
					template: selectAllTemplate,
					controller: 'SelectAllCamaController',
					controllerAs : 'vm',
					size: 'lg',
					resolve: {
						IdHabitacionSelected: function () {
							return _idHabitacionSelected;
						},
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar una cama';
						},
						Module : Module
					}

				}).result;
			}

			function newHabitacion (pUser){
				$log.debug('newHabitacion OK.-');
		
				return $uibModal.open({
					template: habitacionNewTemplate,
					controller: 'HabitacionNewController',
					controllerAs : 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar una cama';
						},
						Module : Module
					}

				}).result;

			}

			function editHabitacion (pIdHabitacionSelected,pUser){

				$log.debug('editHabitacion OK.-', pIdHabitacionSelected);
				var _idHabitacionSelected;
				if (pIdHabitacionSelected)
					_idHabitacionSelected = pIdHabitacionSelected;
				else
					_idHabitacionSelected = null;
		
				return $uibModal.open({
					template: habitacionEditTemplate,
					controller: 'HabitacionEditController',
					controllerAs : 'vm',
					size: 'lg',
					resolve: {
						IdHabitacionSelected: function () {
							return _idHabitacionSelected;
						},
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar una cama';
						},
						Module : Module
					}

				}).result;
			}

			function addCama (pIdHabitacionSelected,pUser){

				$log.debug('editHabitacion OK.-', pIdHabitacionSelected);
				var _idHabitacionSelected;
				if (pIdHabitacionSelected)
					_idHabitacionSelected = pIdHabitacionSelected;
				else
					_idHabitacionSelected = null;
		
				return $uibModal.open({
					template: camaNewTemplate,
					controller: 'CamaNewController',
					controllerAs : 'vm',
					size: 'lg',
					resolve: {
						IdHabitacionSelected: function () {
							return _idHabitacionSelected;
						},
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar una cama';
						},
						Module : Module
					}

				}).result;
			}

		}
	};

	return module;

})();