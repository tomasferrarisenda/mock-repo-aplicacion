/**
 * @author 			emansilla
 * @description 	description
 */
import domicilioModalTemplate = require('../templates/domicilio-modal.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('DomicilioLogicService', DomicilioLogicService);

		// Inyección de dependencia
		DomicilioLogicService.$inject = ['Logger', '$uibModal'];

		// Definición del servicio
		function DomicilioLogicService ($log, $uibModal) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DomicilioLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				openModal: openModalDomicilio,
				changeDomicilioDefecto : changeDomicilioDefecto,
				validaDomicilioDefecto : validaDomicilioDefecto
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function openModalDomicilio (pDomicilio) {
				var _domicilio;
				if (pDomicilio)
					_domicilio = pDomicilio;
				else
					_domicilio = null;

				var _modalInstance = $uibModal.open({
					template: domicilioModalTemplate,
					controller: 'DomicilioModalController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						Domicilio: function () {
							return _domicilio;
						}
					}
				});
				return _modalInstance.result;
			}

			function changeDomicilioDefecto (pDomicilio, pListDomicilio) {
				//$log.debug('changeDomicilioDefecto:', pDomicilio);
				//$log.debug('changeDomicilioDefecto (1):', pListDomicilio);
				for (var i = 0; i < pListDomicilio.length; i++) {
					if (pListDomicilio[i].$$hashKey != pDomicilio.$$hashKey)						
						pListDomicilio[i].Defecto = false;
				}
				validaDomicilioDefecto(pListDomicilio);
			}

			function validaDomicilioDefecto ( pListDomicilio) {
				//$log.debug('validaDomicilioDefecto:', pListDomicilio);
				var bDefectoOk = false;
				for (var i = 0; i < pListDomicilio.length; i++) {					
					if(pListDomicilio[i].Defecto) {
						bDefectoOk = true;
						//$log.debug('validaDomicilioDefecto ok:', i);
						break;
					}
				}
				if (!bDefectoOk && pListDomicilio.length){
					pListDomicilio[0].Defecto = true;
					//$log.debug('validaDomicilioDefecto ok false:', pListDomicilio[0]);
				}
			}
			
		}
	};

	return module;

})();