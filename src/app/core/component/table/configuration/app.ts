/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de agregados de configuracion de tabla
 * @type:			Module
 **/
import * as angular from 'angular';
import TableConfig from "./TableConfig";
import fwTableConfigDirective from "./fwTableConfigDirective";
import fwTableConfigInitializerDirective from "./fwTableConfigInitializerDirective";

(function () {
	'use strict';
	/* Core.Component.Table.Configuration Module */
	const ngModule = angular.module('core.component.table.configuration',[]);

	TableConfig.init(ngModule);
	fwTableConfigDirective.init(ngModule);
	fwTableConfigInitializerDirective.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Configuration');
		// $log.debug('ON.-');
	}
})();