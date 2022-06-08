/**
 * @author 			emansilla
 * @description 	description
 */
import empresaTemplate = require('../templates/empresa-new.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EmpresaLogicService', EmpresaLogicService);

		EmpresaLogicService.$inject = ['Logger', '$uibModal'];
		
		function EmpresaLogicService ($log, $uibModal) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EmpresaLogicService');
			$log.debug('ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				openModal : openModal
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function openModal (pCuit, pUser) {
				var _modalInstance = $uibModal.open({
					template: empresaTemplate,
					controller: 'EmpresaNewController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						},
						Cuit: function () {
							return pCuit;
						}
					}
				});

				return _modalInstance.result;
			}
		}
	};

	return module;

})();