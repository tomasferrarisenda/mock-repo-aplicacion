/**
 * @author 			Diego Robledo
 * @description 	description
 */
import * as angular from 'angular';
import "./listado/app";
import "./simulador/app";

(function () {
	'use strict';
	const module = angular.module('financiadores.convenios', [
		'convenios.listado',
		'convenios.simulador',
	]);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Convenios");
		$log.info('ON.-');
	}]);
})();