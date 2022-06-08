/**
 * @author:			Ezequiel Mansilla
 * @description:	Lógica para gestión de internado
 * @type:			Service
 **/
import busquedaTemplate = require('../templates/busqueda-internado.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternadoLogicService', InternadoLogicService);

		InternadoLogicService.$inject = ['Logger', '$uibModal'];
		
		function InternadoLogicService ($log, $uibModal) {

			$log = $log.getInstance('InternadoLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				searchInternados: searchInternados
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function searchInternados () {
				return $uibModal.open({
					template: busquedaTemplate,
					controller: 'BusquedaInternadoController',
					controllerAs: 'vm',
					size: 'lg'
				}).result;
			}
	
		}
	};

	return module;

})();