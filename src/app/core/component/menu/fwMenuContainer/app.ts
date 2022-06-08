/**
 * @author:			Ezequiel Mansilla
 * @description:	Componente de menu
 * @type:			Module
 **/
import * as angular from 'angular';
import fwMenuContainerDirective from "./fwMenuContainerDirective";
(function () {
	'use strict';
	/* Core.Component.Menu.Container Module */
	const ngModule = angular.module('core.component.menu.container',[]);

	fwMenuContainerDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Menu.Container');
		$log.debug('ON.-');
	}
})();