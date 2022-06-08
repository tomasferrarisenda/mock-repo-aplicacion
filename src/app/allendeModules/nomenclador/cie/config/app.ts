/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import constants from './constants';

(function () {
	'use strict';
	/* Nomenclador.Cie.Config Module */
	const module = angular.module('nomenclador.cie.config', []);

	constants.init(module);
	
	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Nomenclador.Cie.Config');
		$log.debug('ON.-');
	}]);
})();