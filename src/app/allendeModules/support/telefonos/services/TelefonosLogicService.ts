/**
 * @author 			emansilla
 * @description 	description
 */
import telefonoTemplate = require('../templates/telefonos-modal.tpl.html');

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TelefonosLogicService', TelefonosLogicService);

		// Inyección de dependencia
		TelefonosLogicService.$inject = ['Logger', '$uibModal'];

		// Definición del servicio
		function TelefonosLogicService ($log, $uibModal) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TelefonosLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				openModal: openModalTelefono,
				changeTelefonoDefecto : changeTelefonoDefecto,
				validaTelefonoDefecto : validaTelefonoDefecto
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function openModalTelefono (pTelefono) {
				var _telefono;
				if (pTelefono) 
					 _telefono = pTelefono;
				else
					_telefono = null;

				var _modalInstance = $uibModal.open({
					template: telefonoTemplate,
					controller: 'TelefonosModalController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						Telefonos: function () {
							return _telefono;
						}
					}
				});
				
				return _modalInstance.result;
			}

			function changeTelefonoDefecto (pTelefono, pListTelefono) {
				//$log.debug('changeTelefonoDefecto:', pTelefono);
				//$log.debug('changeTelefonoDefecto (1):', pListTelefono);
				for (var i = 0; i < pListTelefono.length; i++) {
					if (pListTelefono[i].Id != pTelefono.Id)
						pListTelefono[i].Defecto = false;
				}
				validaTelefonoDefecto(pListTelefono);
			}

			function validaTelefonoDefecto ( pListTelefono) {		
				//$log.debug('validaTelefonoDefecto:', pListTelefono);		
				var bDefectoOk = false;
				for (var i = 0; i < pListTelefono.length; i++) {					
					if(pListTelefono[i].Defecto) {
						bDefectoOk = true;						
						break;
					}
				}
				if (!bDefectoOk && pListTelefono.length){
					pListTelefono[0].Defecto = true;	
					//$log.debug('validaTelefonoDefecto ok false:', pListTelefono[0]);
				}
			}
		}
	};

	return module;

})();