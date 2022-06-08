/**
 * @author 			Jorge Basiluk
 * @description 	description
 */
import abrirSociedadSelector = require('../templates/sociedad-list-selector.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('SociedadLogicService', SociedadLogicService);

		// Inyección de dependencia
		SociedadLogicService.$inject = ['Logger', '$uibModal', 'TITLE_SOCIEDAD'];

		// Definición del servicio
		function SociedadLogicService ($log, $uibModal, TITLE_SOCIEDAD) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SociedadLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				openSociedadSelector : openSociedadSelector,
				findElements : findElements
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function Module () {
				return  'SOCIEDAD';
			}
			
			function openSociedadSelector (pUser) {
				return $uibModal.open({
					template : abrirSociedadSelector,
					controller : 'SociedadSelectorController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						User: function () {
							return pUser;
						},
						Module : Module,
						Title : function () {
							return TITLE_SOCIEDAD.SOCIEDAD_SELECTOR;
						}
					}
				}).result;
			}

			function findElements(array, itemSearch) {
				var matchingIndices = -1;								

				for(var j = 0; j < array.length; j++)
				{
					if(itemSearch == array[j].Id)
					{	
						matchingIndices = j;
						break;
					}	
				}
				return matchingIndices;
			}
		}
	};

	return module;

})();