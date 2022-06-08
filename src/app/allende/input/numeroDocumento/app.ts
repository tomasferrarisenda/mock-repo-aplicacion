/**
 * @author:			Ezequiel Mansilla
 * @description:	iNputo numero documento
 * @type:			Module
 **/
import * as angular from 'angular';
import saNumeroDocumentoDirective from "./saNumeroDocumentoDirective";

(function () {
	'use strict';
	/* Allende.Input.NumeroDocumento Module */
	const ngModule = angular.module('allende.input.numeroDocumento',[]);
	
	saNumeroDocumentoDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Input.NumeroDocumento');
		$log.debug('ON.-');
	}
})();