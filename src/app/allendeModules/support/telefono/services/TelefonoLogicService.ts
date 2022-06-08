/**
 * @author 			emansilla
 * @description 	description
 */
import telefonosTemplate = require('../templates/telefono-modal.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TelefonoLogicService', TelefonoLogicService);

		// Inyección de dependencia
		TelefonoLogicService.$inject = ['Logger', '$uibModal'];

		// Definición del servicio
		function TelefonoLogicService ($log, $uibModal) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TelefonoLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				openModal: openModalTelefono,
				changeTelefonoDefecto : changeTelefonoDefecto
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function openModalTelefono (pTelefono) {
				var _telefono;
				(pTelefono) ? _telefono = pTelefono : _telefono = null;

				var _modalInstance = $uibModal.open({
					template: telefonosTemplate,
					controller: 'TelefonoModalController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						Telefono: function () {
							return _telefono;
						}
					}
				});
				
				return _modalInstance.result;
			}

			function changeTelefonoDefecto (pTelefono, pListTelefono) {				
				for (var i = 0; i < pListTelefono.length; i++) {
					if (pListTelefono[i].$$hashKey != pTelefono.$$hashKey)
						pListTelefono[i].defecto = false;
				}
			}
		}
	};

	return module;

})();