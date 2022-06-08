/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de integracion comun
 * @type:			Module
 **/
import * as angular from 'angular';
import 'angular-i18n/angular-locale_es-ar';
import 'angular-animate';
import 'angular-sanitize';

(function () {
	'use strict';
	/* Integration.Common Module */
	const ngModule = angular.module('integration.common', [
			'ngLocale',
			'ngAnimate',
			'ngSanitize'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		// i18nService.setCurrentLang('es');
		$log = $log.getInstance('Integration.Common');
		$log.debug('ON.-');
	}
})();