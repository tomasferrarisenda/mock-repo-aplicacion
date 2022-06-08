/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableExport', fwTableExport);

		fwTableExport.$inject = ['$log'];
		function fwTableExport ($log) {
			return {
				restrict : 'E',
				require : ['^fwTableContainer', 'fwTableExport'],
				controller : TableExportController,
				link: link
			};

			function link (scope, element, attrs, controllers) {
				// $log.debug('fwTableExport linked');
				 var fwTableContainerController = controllers[0];
				 var fwTableExportController = controllers[1];

				fwTableContainerController.setExportation(fwTableExportController.getExportation());
			}
		}

		TableExportController.$inject = ['Logger', '$rootScope', 'Exportation', 'ExportationItem'];
		function TableExportController($log, $rootScope, Exportation, ExportationItem) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TableExportController');
			// $log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var exportation : any = {
				label : 'Exportar'
			};

			var vm = this;
			vm.getExportation = getExportation;
			vm.addItem = addItem;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getExportation() {
				return Exportation.build(exportation);
			}

			function addItem(pItem) {

				var exportItem = ExportationItem.build(pItem);
				if (exportItem.isInterna()) exportItem.action = internalExport;

				if (exportItem.isValid()) {
					exportation.addItem(exportItem);
				}
			}

			function internalExport() {
				// $log.debug('internalExport', this);
				$rootScope.$broadcast('fw-table-export-iternal-event', this);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				exportation = Exportation.build(exportation);
			}
		}
	};

	return module;
})();