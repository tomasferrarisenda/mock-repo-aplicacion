/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import UserViewController from "./controllers/UserViewController";
import saUser from "./directives/saUser";

(function () {
	'use strict';
	/* Allende.Basic.User Modules */
	const ngModule = angular.module('allende.basic.user', []);

	states.init(ngModule);
	constants.init(ngModule);
	UserViewController.init(ngModule);
	saUser.init(ngModule);

	ngModule.run(['Logger',function ($log) {
		$log = $log.getInstance('Allende.Basic.User');
		$log.debug('ON.-');
	}]);
})();