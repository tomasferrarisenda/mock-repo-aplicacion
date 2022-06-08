/**
 * @author:			Ezequiel Mansilla
 * @description:	Exportacion PDF externa
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableExportPdfExt', fwTableExportPdfExt);

		fwTableExportPdfExt.$inject = ['$log'];
		function fwTableExportPdfExt ($log) {
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
				// $log.debug('fwTableExportPdfExt linked');
				fwTableExportController.addItem({
					label : scope.label || 'Exportar como pdf',
					status : scope.status,
					type : 'externa',
					action : scope.export,
					format : 'pdf'
				});
			}
		}
	};

	return module;
})();