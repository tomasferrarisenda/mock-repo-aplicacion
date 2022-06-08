/**
 * @author 			emansilla
 * @description 	description
 */
import nacionalidadTemplate = require('../templates/nacionalidad-modal.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('NacionalidadLogicService', NacionalidadLogicService);

		// Inyección de dependencia
		NacionalidadLogicService.$inject = ['Logger', '$uibModal'];

		// Definición del servicio
		function NacionalidadLogicService ($log, $uibModal) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('NacionalidadLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			const service = {
				openModal: openModalNacionalidad,
				changeNacionalidadDefecto : changeNacionalidadDefecto,
				validaNacionalidadDefecto : validaNacionalidadDefecto
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function openModalNacionalidad (pNacionalidad) {
				var _nacionalidad;
				if (pNacionalidad)
					_nacionalidad = pNacionalidad;
				else
					_nacionalidad = null;

				//$log.debug('Nacionalidad Modal que llega:', pNacionalidad);

				var _modalInstance = $uibModal.open({
					template: nacionalidadTemplate,
					controller: 'NacionalidadModalController',
					controllerAs: 'vm',
					size: 'md',
					resolve: {
						Nacionalidad: function () {
							return _nacionalidad;
						}
			
					}
				});				
			
				return _modalInstance.result;	
			}

			function changeNacionalidadDefecto (pNacionalidad, pListNacionalidad) {				
				for (var i = 0; i < pListNacionalidad.length; i++) {
					if (pListNacionalidad[i].$$hashKey != pNacionalidad.$$hashKey)
						pListNacionalidad[i].Defecto = false;
				}
			}
			function validaNacionalidadDefecto ( pListNacionalidad) {
				//$log.debug('validaNacionalidadDefecto:', pListNacionalidad);
				var bDefectoOk = false;
				for (var i = 0; i < pListNacionalidad.length; i++) {					
					if(pListNacionalidad[i].Defecto) {
						bDefectoOk = true;
						//$log.debug('validaNacionalidadDefecto ok:', i);
						break;
					}
				}
				if (!bDefectoOk && pListNacionalidad.length){
					pListNacionalidad[0].Defecto = true;
					//$log.debug('validaNacionalidadDefecto ok false:', pListNacionalidad[0]);
				}
			}
		}
	};

	return module;
})();