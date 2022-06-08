/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de ABMC
 * @type:			Module
 **/
import * as angular from 'angular';
import AbmcModel from "./AbmcModel";
import AbmcModelAttribute from "./AbmcModelAttribute";
import fwAbmcModelDirective from "./fwAbmcModelDirective";
import fwAbmcModelAttributeDirective from "./fwAbmcModelAttributeDirective";

(function () {
	'use strict';
	/* Core.Component.Abmc.Model Module */
	const ngModule = angular.module('core.component.abmc.model',[]);

	AbmcModel.init(ngModule);
	AbmcModelAttribute.init(ngModule);
	fwAbmcModelDirective.init(ngModule);
	fwAbmcModelAttributeDirective.init(ngModule);
	
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Abmc.Model');
		$log.debug('ON.-');
	}

})();