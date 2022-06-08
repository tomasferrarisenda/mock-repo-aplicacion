/**
 * @author:			Ezequiel Mansilla
 * @description:	Tabla generica
 * @type:			Module
 **/
import * as angular from 'angular';
import fwTableContainerDirective from "./fwTableContainerDirective";
(function () {
	'use strict';
	/* Core.Component.Table.Container Module */
	const ngModule = angular.module('core.component.table.container',[]);

	fwTableContainerDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Container');
		// $log.debug('ON.-');
	}
})();