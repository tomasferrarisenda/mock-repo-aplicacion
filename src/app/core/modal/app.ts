/**
 * @author:			Ezequiel Mansilla
 * @description:	Módulo de modales
 * @type:			Module
 **/
import * as angular from 'angular';
import fwModalDirective from "./directives/fwModalDirective";
import fwModalBodyDirective from "./directives/fwModalBodyDirective";
import fwModalFooterDirective from "./directives/fwModalFooterDirective";
import fwModalHeaderDirective from "./directives/fwModalHeaderDirective";

(function () {
	'use strict';
	/* Core.Modal Module */
	const ngModule = angular.module('core.modal',[]);

	fwModalDirective.init(ngModule);
	fwModalBodyDirective.init(ngModule);
	fwModalFooterDirective.init(ngModule);
	fwModalHeaderDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Modal');
		$log.debug('ON.-');
	}
})();