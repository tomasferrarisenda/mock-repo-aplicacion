/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from './config/states';
import HomeSistemaController from './controllers/HomeSistemaController';

(function () {
	'use strict';
	/* Allende.Basic.Home Modules */
	const ngModule = angular.module('allende.basic.home',[]);

	states.init(ngModule);
	HomeSistemaController.init(ngModule);

	ngModule.run(['Logger',function ($log) {
		$log = $log.getInstance('Allende.Basic.Home');
		$log.debug('ON.-');
	}]);
})();