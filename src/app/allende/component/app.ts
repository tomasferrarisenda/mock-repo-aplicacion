/**
 * @author:			Ezequiel Mansilla
 * @description:	Componentes de allende
 * @type:			Module
 **/
import * as angular from 'angular';

import "./menu/app";
import "./selector/app";
import "./sidebar/app";
import "./table/app";
import "./title/app";
import "./workSpinner/app";

(function () {
	'use strict';
	/* Allende.Component Module */
	const ngModule = angular.module('allende.component',[
		'allende.component.menu',
		'allende.component.selector',
		'allende.component.sidebar',
		'allende.component.table',
		'allende.component.title',
		'allende.component.workSpinner'
	]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Component');
		$log.debug('ON.-');
	}
})();