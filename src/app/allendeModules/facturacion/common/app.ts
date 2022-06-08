import * as angular from 'angular';
import "./infoFinanciador/app";
import "./selector/app";

(function () {
	/* Facturacion Module */
	const module = angular.module('facturacion.common', [
		'facturacion.common.infoFinanciador',
		'facturacion.common.selector'
	]);
	module.run(run);

	run.$inject = ['$log'];

	function run ($log) {
	}
})();