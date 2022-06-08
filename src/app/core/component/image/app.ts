/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo para gestion de imagenes
 * @type:			Module
 **/
import * as angular from 'angular';
import fwImageDirective from "./fwImageDirective";
(function () {
	'use strict';
	/* Core.Component.Image Module */
	const ngModule = angular.module('core.component.image',[]);

	fwImageDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Image');
		$log.debug('ON.-');
	}

})();