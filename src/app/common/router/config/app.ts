/**
 * @author:			Ezequiel Mansilla
 * @description:	Configuracion de router
 * @type:			Module
 **/
import * as angular from 'angular';
import defaultRouterConstante from "./defaultRouterConstante";
import states from "./states";
import run from "./run";

(function () {
	'use strict';
	/* Common.Router.Config Module */
	const ngModule = angular.module('common.router.config',[]);

	defaultRouterConstante.init(ngModule);
	states.init(ngModule);
	run.init(ngModule);
	ngModule.run(runMethod);

	runMethod.$inject = ['Logger'];

	function runMethod ($log) {
		$log = $log.getInstance('Common.Router.Config');
		$log.debug('ON.-');
	}
})();