/**
 * @author:			Ezequiel Mansilla
 * @description:	Alerta 
 * @type:			Module
 **/
import * as angular from 'angular';

import AlertaService from "./services/AlertaService";
import AlertaDataService from "./services/AlertaDataService";

import saAlerta from "./directives/saAlerta";
import saMenuAlertas from "./directives/saMenuAlertas";
import saMenuAlertasItem from "./directives/saMenuAlertasItem";
import saToggleAlertas from "./directives/saToggleAlertas";

import "./config/app";

(function () {
	'use strict';

	/* Core.Notification.Alerta Module */
	const ngModule = angular.module('core.notification.alerta',[
			'core.notification.alerta.config'
		]);

	AlertaService.init(ngModule);
	AlertaDataService.init(ngModule);
	saAlerta.init(ngModule);
	saMenuAlertas.init(ngModule);
	saMenuAlertasItem.init(ngModule);
	saToggleAlertas.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Notification.Alerta');
		$log.debug('ON.-');
	}
})();