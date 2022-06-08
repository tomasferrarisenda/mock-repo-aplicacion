import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import "./internacion/app";
import "./ambulatorio/app";
import "./revaluacion/app";
(function () {
		/* Prefacturacion Module */
		const module = angular.module('facturacion.prefactura', [
			'facturacion.prefactura.internacion',
			'facturacion.prefactura.ambulatorio',
			'facturacion.prefactura.revaluacion']);

		states.init(module);
		constants.init(module);
		module.run(run);

		run.$inject = ['$log'];

		function run ($log) {
			//$log = $log.getInstance('Facturacion.Ambulatorio.Prefactura');
			//$log.info('ON.-');
		}
	}
)();