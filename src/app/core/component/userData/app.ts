/**
 * @author:			Ezequiel Mansilla
 * @description:	User Data
 * @type:			Module
 **/
import * as angular from 'angular';
import fwUserDataDirective from "./fwUserDataDirective";
import fwUserEmpresaComponent from "./components/fwUserEmpresaComponent"
(function () {
	'use strict';
	/* Core.Component.UserData Module */
	const ngModule = angular.module('core.component.userData',[]);

	fwUserDataDirective.init(ngModule);
	fwUserEmpresaComponent.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.UserData');
		$log.debug('ON.-');
	}
})();