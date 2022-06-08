import * as angular from 'angular';
import 'angular-bootstrap-grid-tree';

/*Documentacion asociada al arbol https://github.com/khan4019/tree-grid-directive */

(function () {
	'use strict';
	/* Integration.Moment Module */
	const ngModule = angular.module('integration.ngJsTree', [
		'treeGrid'
	]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.ngJsTree');
		$log.debug('ON.-');
	}
})();