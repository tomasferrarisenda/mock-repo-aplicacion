/**
 * @author:			Ezequiel Mansilla
 * @description:	Componentes menu
 * @type:			Module
 **/
import * as angular from 'angular';
import "./fwMenuContainer/app";
import "./fwMenuItem/app";
import "./fwMenuEvent/app";

(function () {
	'use strict';
	/* Core.Component.Menu Module */
	const ngModule = angular.module('core.component.menu',[
			'core.component.menu.container',
			'core.component.menu.item',
			'core.component.menu.event'
		]);
	
	ngModule.run(run);
	run.$inject = ['Logger'];
	function run ($log) {
		$log = $log.getInstance('Core.Component.Menu');
		$log.debug('ON.-');
	}
})();