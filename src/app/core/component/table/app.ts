/**
 * @author:			Ezequiel Mansilla
 * @description:	Generacion de tablas
 * @type:			Module
 **/
import * as angular from 'angular';
import "./configuration/app";
import "./column/app";
import "./pagination/app";
import "./table/app";
import "./container/app";
import "./button/app";
import "./row/app";
import "./sorting/app";
import "./filtering/app";
import "./exportation/app";

(function () {
	'use strict';
	/* Core.Component.Table Module */
	const ngModule = angular.module('core.component.table',[
		'core.component.table.configuration',
		'core.component.table.column',
		'core.component.table.pagination',
		'core.component.table.table',
		'core.component.table.container',
		'core.component.table.tableButton',
		'core.component.table.row',
		'core.component.table.sorting',
		'core.component.table.filtering',
		'core.component.table.exportation'
	]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table');
		$log.debug('ON.-');
	}
})();