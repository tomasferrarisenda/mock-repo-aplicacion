/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de integracion para moment
 * @type:			Module
 **/
import * as angular from 'angular';
import 'moment';
import 'moment/locale/es';
import 'angular-moment';
(function () {
	'use strict';
	/* Integration.Moment Module */
	const ngModule = angular.module('integration.moment', [
			'angularMoment'
		]);

	ngModule.run(run);

	run.$inject = ['Logger', 'amMoment'];

	function run ($log, amMoment) {
		amMoment.changeLocale('es');
		$log = $log.getInstance('Integration.Moment');
		$log.debug('ON.-');
	}
})();