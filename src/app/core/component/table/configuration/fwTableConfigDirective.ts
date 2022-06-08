/**
 * @author:			Ezequiel Mansilla
 * @description:	Directive de configuracion de tabla
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableConfig', fwTableConfig);

		fwTableConfig.$inject = ['$log', 'TableConfig'];
		function fwTableConfig ($log, TableConfig) {
			return {
				restrict : 'EA',
				require : '^fwTableContainer',
				scope : {
					exportable : '<?',
					sortable : '<?',
					columnConfig : '<?',
					paginable : '<?',
					filtrable : '<?'
				},
				link: link
			};

			function link (scope, element, attrs, fwTableContainerController) {
				// $log.debug('fwTableConfig linked');

				var config = TableConfig.build({
					exportable : scope.exportable,
					sortable : scope.sortable,
					columnConfig : scope.columnConfig,
					paginable : scope.paginable,
					filtrable : scope.filtrable
				});

				fwTableContainerController.setConfig(config);
			}
		}
	};

	// <fw-table-config
	// 			exportable="true"
	// 			sortable="true"
	// 			column-config="true">
	// 		</fw-table-config>

	return module;
})();