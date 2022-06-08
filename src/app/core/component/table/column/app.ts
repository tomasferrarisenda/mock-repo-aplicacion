/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de gestion de columnas de tabla
 * @type:			Module
 **/
import * as angular from 'angular';
import Column from "./Column";
import fwTableColumnSetDirective from "./fwTableColumnSetDirective";
import fwTableColumnDirective from "./fwTableColumnDirective";
import fwColumnInitializerDirective from "./fwColumnInitializerDirective";

(function () {
	'use strict';
	
	/* Core.Component.Table.Column Module */
	const ngModule = angular.module('core.component.table.column',[]);

	Column.init(ngModule);
	fwTableColumnSetDirective.init(ngModule);
	fwTableColumnDirective.init(ngModule);
	fwColumnInitializerDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Column');
		// $log.debug('ON.-');
	}
})();