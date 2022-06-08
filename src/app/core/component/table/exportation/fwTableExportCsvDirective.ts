/**
 * @author:			Ezequiel Mansilla
 * @description:	Exportacion CSV interna
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableExportCsv', fwTableExportCsv);

		fwTableExportCsv.$inject = ['$log'];
		function fwTableExportCsv ($log) {
			return {
				restrict : 'E',
				require : '^fwTableExport',
				scope : {
					label : '<?',
					status : '<?',
					data: '@?'
				},
				link: link
			};

			function link (scope, element, attrs, fwTableExportController) {
				// $log.debug('fwTableExportCsv linked');
				fwTableExportController.addItem({
					label : scope.label || 'Exportar como csv',
					status : scope.status,
					type : 'interna',
					format : 'csv',
					data: scope.data
				});
			}
		}
	};

	return module;
})();