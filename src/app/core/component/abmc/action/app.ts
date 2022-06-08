/**
 * @author:			Ezequiel Mansilla
 * @description:	Items de AMBC
 * @type:			Module
 **/
import * as angular from 'angular';
import AbmcAction from "./AbmcAction";
import AbmcActionService from "./AbmcActionService";
import fwAbmcActionsetDirective from "./fwAbmcActionsetDirective";
import fwAbmcActionDirective from "./fwAbmcActionDirective";
import fwAbmcActionListDirective from "./fwAbmcActionListDirective";

(function () {
	'use strict';

	/* Core.Component.Abmc.Action Module */
	const ngModule = angular.module('core.component.abmc.action',[]);

	AbmcAction.init(ngModule);
	AbmcActionService.init(ngModule);
	fwAbmcActionsetDirective.init(ngModule);
	fwAbmcActionDirective.init(ngModule);
	fwAbmcActionListDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Abmc.Action');
		$log.debug('ON.-');
	}
})();