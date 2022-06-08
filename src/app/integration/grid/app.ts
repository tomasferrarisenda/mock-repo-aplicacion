/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import 'angular-ui-grid';
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import './ui-grid.scss';

// var Highcharts = require('highcharts');
// // Load module after Highcharts is loaded
// require('highcharts/modules/exporting')(Highcharts);
// require('highcharts/themes/dark-unica')(Highcharts);

(function () {
	'use strict';
	/* CIntegration.re.Grid Modules */
	const ngModule = angular.module('integration.grid', [
		'ui.grid',
		'ui.grid.selection',
		'ui.grid.exporter',
		'ui.grid.expandable',
		'ui.grid.resizeColumns',
		'ui.grid.treeView']);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Integration.Grid');
		$log.debug('ON.-');
	}]);
	
})();