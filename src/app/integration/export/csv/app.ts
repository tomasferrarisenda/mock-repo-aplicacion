/**
 * @author:			Ezequiel Mansilla
 * @description:	Csv export
 * @type:			Module
 **/
import * as angular from 'angular';
import 'ng-csv';

(function () {
	'use strict';
	/* Integration.Export.Csv Module */
	const ngModule = angular.module('integration.export.csv', [
			'ngCsv'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.Export.Csv');
		$log.debug('ON.-');
	}
})();