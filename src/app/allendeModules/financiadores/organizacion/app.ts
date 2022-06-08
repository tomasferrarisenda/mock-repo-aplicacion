/**
 * @author 			Diego Robledo
 * @description 	description
 */
import * as angular from 'angular';
import "./gestion/app";
import "./common/app";


(function () {
	'use strict';
	const module = angular.module('financiadores.organizacion', [
		'financiadores.organizacion.gestion',
		'financiadores.organizacion.common',
		
		
	]);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Organizacion");
	}]);
})();