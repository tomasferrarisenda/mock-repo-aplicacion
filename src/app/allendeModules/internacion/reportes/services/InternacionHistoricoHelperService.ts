/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternacionHistoricoHelperService', InternacionHistoricoHelperService);

		InternacionHistoricoHelperService.$inject = ['Logger'];
		
		function InternacionHistoricoHelperService ($log) {

			$log = $log.getInstance('InternacionHistoricoHelperService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var _filters;
			var _flag;

			const service = {
				setFilters : setFilters,
				getFilters : getFilters,
				cleanFilters : cleanFilters,
				hayFiltros : hayFiltros
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function cleanFilters() {
				_filters = {};
				_flag = false;
			}
			function setFilters(pFilters) {
				_filters = angular.copy(pFilters);
				_flag = true;
			}

			function getFilters () {
				var filters = angular.copy(_filters);
				return filters;
			}

			function hayFiltros() {
				return _flag || false;
			}
		}
	};

	return module;

})();