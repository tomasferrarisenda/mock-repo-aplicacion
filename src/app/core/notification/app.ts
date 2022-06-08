/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import "./alerta/app";
import "./modal/app";

(function () {
	'use strict';
	/* Core.Notification Module */
	const ngModule = angular.module('core.notification',[
			'core.notification.alerta',
			'core.notification.modal'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];
	function run ($log ) {
		$log = $log.getInstance('Core.Notification');
		$log.debug('ON.-');
	}
})();