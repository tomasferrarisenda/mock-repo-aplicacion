/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva inivializar configuration
 * @type:			Directive
 **/
import fwTableConfigurationTemplate = require("./fwTableConfigurationTemplate.html");
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableConfigInitializer', fwTableConfigInitializer);

		fwTableConfigInitializer.$inject = ['$log'];
		function fwTableConfigInitializer ($log) {
			return {
				restrict : 'E',
				template : fwTableConfigurationTemplate,
				link: link
			};

			function link () {
				// $log.debug('fwTableConfigInitializer linked');
			}
		}
	};

	return module;
})();