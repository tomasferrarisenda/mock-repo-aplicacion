/**
 * @author:			Ezequiel Mansilla
 * @description:	Exportacion CSV externa
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableExportCsvExt', fwTableExportCsvExt);

		fwTableExportCsvExt.$inject = ['$log'];
		function fwTableExportCsvExt ($log) {
			return {
				restrict : 'E',
				require : '^fwTableExport',
				scope : {
					label : '<?',
					status : '<?',
					export : '&?'
				},
				link: link
			};

			function link (scope, element, attrs, fwTableExportController) {
				// $log.debug('fwTableExportCsvExt linked');
				fwTableExportController.addItem({
					label : scope.label || 'Exportar todo como csv',
					status : scope.status,
					type : 'externa',
					action : scope.export,
					format : 'csv'
				});
			}
		}
	};

	return module;
})();