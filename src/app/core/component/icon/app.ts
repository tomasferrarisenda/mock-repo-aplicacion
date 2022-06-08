/**
 * @author:			Ezequiel Mansilla
 * @description:	Iconos
 * @type:			Module
 **/
import * as angular from 'angular';
import fwIconDirective from "./fwIconDirective";
import fwIconListConstant from "./fwIconListConstant";
(function () {
	'use strict';
		/* Core.Component.Icon Module */
		const ngModule = angular.module('core.component.icon',[]);

		fwIconDirective.init(ngModule);
		fwIconListConstant.init(ngModule);
		ngModule.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance('Core.Component.Icon');
			$log.debug('ON.-');
		}

})();