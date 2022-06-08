/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import "./config/app";
import "./common/app";
import "./gestion/app";


(function () {
	'use strict';
	/* Mutual Module */
	const module = angular.module('financiadores.mutual',[
			'financiadores.mutual.config',
			'financiadores.mutual.common',
			'financiadores.mutual.gestion'
					
		]);
	
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Financiadores.Mutual");
		$log.info('ON.-');
	}
})();