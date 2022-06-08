/**
 * @author:			Ezequiel Mansilla
 * @description:	Inicializacion de columna en view
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwColumnTemplate = require('./fwColumnTemplate.html');
import './fwColumn.scss';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwColumnInitializer', fwColumnInitializer);

		fwColumnInitializer.$inject = ['$log', '$rootScope'];
		function fwColumnInitializer ($log, $rootScope) {
			return {
				restrict : 'E',
				template : fwColumnTemplate,
				link: link
			};

			function link (scope) {
				// $log.debug('fwColumnInitializer linked');

				scope.setColumnOrdenable = setColumnOrdenable;

				function setColumnOrdenable(pCol, idTable) {
					pCol.nextSortType();
					$rootScope.$broadcast('fw-table-column-set-ordenable', {
						column : pCol,
						idTable : idTable
					});
				}
			}
		}
	};

	return module;
})();