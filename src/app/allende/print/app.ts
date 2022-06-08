/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import PrintSelectionController from "./controllers/PrintSelectionController";
import PrintSelectionService from "./services/PrintSelectionService";

(function () {
	'use strict';
	/* Allende.Print Modules */
	const ngModule = angular.module('allende.print', []);

	PrintSelectionController.init(ngModule);
	PrintSelectionService.init(ngModule);

	ngModule.run(['Logger',function ($log) {
		$log = $log.getInstance('Allende.Print');
		$log.debug('ON.-');
	}]);

})();