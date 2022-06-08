/**
 * @author:			Ezequiel Mansilla
 * @description:	Tabla template
 * @type:			Module
 **/
import * as angular from 'angular';
import Table from "./Table";
import fwTableDirective from "./fwTableDirective";
import './fwTable.scss';

(function () {
	'use strict';
	/* Core.Component.Table.Table Module */
	const ngModule = angular.module('core.component.table.table',[]);

	Table.init(ngModule);
	fwTableDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Table');
		// $log.debug('ON.-');
	}
})();