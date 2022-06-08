/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import "./common/app";
import "./config/app";
import "./gestion/app";
import "./old/app";


(function (){

	'use strict';
	const ngModule = angular.module('basicos.servicios', [
		'servicios.common',
		'servicios.config',	
		'servicios.gestion',
		'servicios.old'
	]);

	ngModule.run(run);
	run.$inject = ['Logger'];
	function run ($log) {
		$log = $log.getInstance("Servicios");
		$log.debug('ON.-');
	}

})();