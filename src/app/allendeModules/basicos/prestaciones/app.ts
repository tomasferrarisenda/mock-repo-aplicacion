/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import "./common/app";
import "./config/app";
import "./gestion/app";

(function(){
	
		'use strict';
		const ngModule = angular.module('basicos.prestaciones',[
			'prestaciones.common',
			'prestaciones.config',
 		 	'prestaciones.gestion',
		]);	
	
		ngModule.run(run);
		run.$inject = ['Logger'];
		function run ($log) {
			$log = $log.getInstance("Prestaciones");
			$log.info('ON.-');
		}
	
})();

