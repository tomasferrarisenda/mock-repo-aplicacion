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
		const ngModule = angular.module('basicos.especialidades',[
			'especialidades.common',
			'especialidades.config',
 		 	'especialidades.gestion',
		]);	
	
		ngModule.run(run);
		run.$inject = ['Logger'];
		function run ($log) {
			$log = $log.getInstance("Especialidades");
			$log.info('ON.-');
		}
	
})();

