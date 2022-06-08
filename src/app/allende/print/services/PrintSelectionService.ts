/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import selectPrintTemplate = require("../views/select-print.html");

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('PrintSelectionService', PrintSelectionService);

		PrintSelectionService.$inject = ['Logger', '$uibModal', 'AuthorizationService'];
		
		function PrintSelectionService ($log, $uibModal, AuthorizationService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrintSelectionService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				open : open
			};

			return service;

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			function open (pUser, pIdPermiso) {

				var impresiones = [];

				if (angular.isArray(pIdPermiso)) {
					impresiones = AuthorizationService.getImpresionesByIdsPermiso(pUser, pIdPermiso);					
				} else {
					impresiones = AuthorizationService.getImpresionesByIdPermiso(pUser, pIdPermiso);
				}

				return $uibModal.open({
					template: selectPrintTemplate,
					controller: 'PrintSelectionController',
					controllerAs: 'vm',
					resolve: {
						Prints : function () {
							return impresiones;
						}
					},
					size: 'md'
				}).result;

			}
		}
	};

	return module;

})();