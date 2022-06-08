/**
 * @author:			Ezequiel Mansilla
 * @description:	Work Spinner
 * @type:			Module
 **/
import * as angular from 'angular';
import saWorkSpinnerDirective from "./saWorkSpinnerDirective";
import saWorkSpinnerNotDirective from "./saWorkSpinnerNotDirective";

(function () {
	'use strict';
	/* Allende.Component.WorkSpinner Module */
		const ngModule = angular.module('allende.component.workSpinner',[]);

		saWorkSpinnerDirective.init(ngModule);
		saWorkSpinnerNotDirective.init(ngModule);
		ngModule.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance('Allende.Component.WorkSpinner');
			$log.debug('ON.-');
		}
})();