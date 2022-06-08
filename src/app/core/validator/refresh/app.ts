/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de validacion de refresco
 * @type:			Module
 **/
import * as angular from 'angular';
import fwValidRefreshDirective from './fwValidRefreshDirective';

(function () {
	'use strict';
	/* Core.Validator.Refresh Module */
	const ngModule = angular.module('core.validator.refresh', []);

	fwValidRefreshDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Validator.Refresh');
		$log.debug('ON.-');
	}
})();