/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de Allende logos
 * @type:			Module
 **/
import * as angular from 'angular';
import saLogos from "./directives/saLogos";
(function () {
	'use strict';
		
	/* Allende.Logo Module */
	const ngModule = angular.module('allende.logo',[]);

	saLogos.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Logo');
		$log.debug('ON.-');
	}

})();