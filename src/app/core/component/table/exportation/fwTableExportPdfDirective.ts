/**
 * @author:			Ezequiel Mansilla
 * @description:	Exportacion PDF interna
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableExportPdf', fwTableExportPdf);

		fwTableExportPdf.$inject = ['$log'];
		function fwTableExportPdf ($log) {
			return {
				restrict : 'E',
				require : '^fwTableExport',
				scope : {
					label : '<?',
					status : '<?'
				},
				link: link
			};

			function link (scope, element, attrs, fwTableExportController) {
				// $log.debug('fwTableExportPdf linked');
				fwTableExportController.addItem({
					label : scope.label || 'Exportar como pdf',
					status : scope.status,
					type : 'interna',
					format : 'pdf'
				});
			}
		}
	};

	return module;
})();