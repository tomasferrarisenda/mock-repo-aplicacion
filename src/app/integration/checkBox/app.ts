/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import 'angular-ui-switch';
import './checkbox.scss';
	
(function () {
	'use strict';
	/* CIntegration.re.CheckBox Modules */
	const ngModule = angular.module('integration.checkBox', [
		'uiSwitch',
		]);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Integration.CheckBox');
		$log.debug('ON.-');
	}]);
	
})();