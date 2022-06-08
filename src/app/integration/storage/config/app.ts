/**
 * @author:			Ezequiel Mansilla
 * @description:	COnfig de storage
 * @type:			Module
 **/
import * as angular from 'angular';
import config from './config';

(function () {
	'use strict';
		
	/* Integration.Storage.Config Module */
	const ngModule = angular.module('integration.storage.config', []);

	config.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.Storage.Config');
		$log.debug('ON.-');
	}

})();