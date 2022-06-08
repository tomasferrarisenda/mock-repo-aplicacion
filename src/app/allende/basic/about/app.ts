/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from './states';
import AboutComponent from './AboutComponent';

(function () {
	'use strict';
	/* Allende.Basic.About Module */
	const ngModule = angular.module('allende.basic.about',[]);
	
	states.init(ngModule);
	AboutComponent.init(ngModule);

	ngModule.run(['Logger',function ($log) {
		$log = $log.getInstance('Allende.Basic.About');
		$log.debug('ON.-');
	}]);
})();