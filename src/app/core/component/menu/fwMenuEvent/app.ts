/**
 * @author:			Ezequiel Mansilla
 * @description:	Eventos para menu
 * @type:			Module
 **/
import * as angular from 'angular';
import fwToggleMenuHoverDirective from "./fwToggleMenuHoverDirective";
import fwToggleMenuClickDirective from "./fwToggleMenuClickDirective";
import MenuEventService from "./MenuEventService";

(function () {
	'use strict';
	/* Core.Component.Menu.Event Module */
	const ngModule = angular.module('core.component.menu.event',[]);

	fwToggleMenuHoverDirective.init(ngModule);
	fwToggleMenuClickDirective.init(ngModule);
	MenuEventService.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Menu.Event');
		$log.debug('ON.-');
	}
})();