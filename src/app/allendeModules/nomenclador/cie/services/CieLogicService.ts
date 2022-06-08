/**
 * @author 			emansilla
 * @description 	description
 */
import cieListTemplate = require('../templates/cie-list.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CieLogicService', CieLogicService);

		// Inyección de dependencia
		CieLogicService.$inject = ['Logger', '$uibModal']

		// Definición del servicio
		function CieLogicService ($log, $uibModal) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CieLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				openSelector: openSelector
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN  ------------------------------------------ */

			function openSelector (pUser) {

				return $uibModal.open({
					template: cieListTemplate,
					controller: 'CieListSelectorController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar un diagnóstico';
						},
						Module : Module
					}
				}).result;
			}

			function Module () {
				return 'NOMENCLADOR CIE10';
			}
		};
	};

	return module;

})();