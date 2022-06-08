/**
 * @author 			mastore
 * @description 	description
 */
import * as angular from 'angular';
import constants from "./constants";
import states from "./states";

(function () {
	'use strict';

		/* Internacion.Config Module */
		const module = angular.module('guardia.config', []);

		constants.init(module);
		states.init(module);

		module.run(['Logger', function ($log) {
			$log = $log.getInstance("Guardia.Config");
			$log.debug('ON.-');
		}]);
	}
)();