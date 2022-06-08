/**
 * @author:			Ezequiel Mansilla
 * @description:	Toast
 * @type:			Module
 **/
import * as angular from 'angular';
import 'angular-animate';
import 'angularjs-toaster';

(function () {
	'use strict';

	/* Integration.Toaster Module */
	const ngModule = angular.module('integration.toaster', ['toaster']);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.Toaster');
		$log.debug('ON.-');
	}
})();