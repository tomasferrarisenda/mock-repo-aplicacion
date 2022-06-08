/**
 * @author:			Ezequiel Mansilla
 * @description:	Filtrado de tabla
 * @type:			Module
 **/
import * as angular from 'angular';
import Filter from "./Filter";
import Filtering from "./Filtering";
import fwTableFilterDirective from "./fwTableFilterDirective";
import fwFilterInitializerDirective from "./fwFilterInitializerDirective";
(function () {
	'use strict';
	/* Core.Component.Table.Filtering Module */
	const ngModule = angular.module('core.component.table.filtering',[]);

	Filter.init(ngModule);
	Filtering.init(ngModule);
	fwTableFilterDirective.init(ngModule);
	fwFilterInitializerDirective.init(ngModule);
	
	ngModule.run(run);

	run.$inject = ['Logger'];
	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Filtering');
		// $log.debug('ON.-');
	}
})();