/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import StorageService from './services/StorageService';
import 'angular-local-storage';
import './config/app';

(function () {
	'use strict';

	/* Integration.Storage Modules */
	const ngModule = angular.module('integration.storage', [
			'LocalStorageModule',
			'integration.storage.config'
		]);

	StorageService.init(ngModule);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Integration.Storage');
		$log.debug('ON.-');
	}]);

})();