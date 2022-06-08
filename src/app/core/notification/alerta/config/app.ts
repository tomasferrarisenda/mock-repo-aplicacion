/**
 * @author:			Ezequiel Mansilla
 * @description:	COnfig de notificaciones
 * @type:			Module
 **/
import * as angular from 'angular';
import alertaTypesConstant from "./alertaTypesConstant";
import events from "./events";

(function () {
	'use strict';		
	/* Core.Notification.Alerta.Config Module */
	const ngModule = angular.module('core.notification.alerta.config',[]);

	alertaTypesConstant.init(ngModule);
	events.init(ngModule);

	ngModule.run(runMethod);

	runMethod.$inject = ['Logger'];

	function runMethod ($log) {
		$log = $log.getInstance('Core.Notification.Alerta.Config');
		$log.debug('ON.-');
	}
})();