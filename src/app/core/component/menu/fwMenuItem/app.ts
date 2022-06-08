/**
 * @author:			Ezequiel Mansilla
 * @description:	Items de menu
 * @type:			Module
 **/
import * as angular from 'angular';
import fwMenuItemDirective from "./fwMenuItemDirective";
(function () {
	'use strict';
	/* Core.Component.Menu.Item Module */
	const ngModule = angular.module('core.component.menu.item',[]);

	fwMenuItemDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Menu.Item');
		$log.debug('ON.-');
	}
})();