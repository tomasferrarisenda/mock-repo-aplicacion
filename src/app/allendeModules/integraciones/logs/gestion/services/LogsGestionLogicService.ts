/**
 * @author 			jbasiluk
 * @description 	description
 */
import logViewTemplate = require('../templates/logs-view.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('LogsGestionLogicService', LogsGestionLogicService);

		LogsGestionLogicService.$inject = ['Logger','$q', '$uibModal', 'ModalService', 'LogsGestionDataService',
			'AuthorizationService', 
			'ACTION_LOGS'
		];
		
		function LogsGestionLogicService ($log,$q, $uibModal, ModalService, LogsGestionDataService,
			AuthorizationService, 
			ACTION_LOGS) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('LogsGestionLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				validarEsListAll : validarEsListAll,
				selectList : selectList,
				viewItem : viewItem				
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function selectList (pUser) {
				//return AuthorizationService.GetActionPathByPermission(pUser, PERMISSION_SERVICIOS.LIST)
			}

			function validarEsListAll (pActionPath) {
				if(pActionPath == ACTION_LOGS.LIST) {
					return true;
				} else {
					return false;
				}
			}

	
			function Module () {
				return 'LOGS'; 
			}

			function viewItem () {
				return $uibModal.open({
					template: logViewTemplate,
					controller: 'LogsViewController',
					controllerAs: 'vm',
					size: 'lg'
				}).result;
			}
		}
	};

	return module;

})();