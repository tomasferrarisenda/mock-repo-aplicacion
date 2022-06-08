/**
 * @author:			Pablo Pautasso
 * @description:	app para contextMenu
 * @type:			Module
 **/
import * as angular from 'angular';
import 'angular-bootstrap-contextmenu';

(function () {
	'use strict';
	/* Integration.ContextMenu Module */
	const module = angular.module('integration.contextMenu', [
		'ui.bootstrap.contextMenu']);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.ContextMenu');
		$log.debug('ON.-');
	}

})();