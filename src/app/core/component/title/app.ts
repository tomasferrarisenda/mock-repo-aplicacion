/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para titulos
 * @type:			Module
 **/
import * as angular from 'angular';
import fwTitleWrapperDirective from "./directives/fwTitleWrapperDirective";
import fwTitleDirective from "./directives/fwTitleDirective";
import fwTitleButtonGroupDirective from "./directives/fwTitleButtonGroupDirective";
import fwTitleButtonDirective from "./directives/fwTitleButtonDirective";
(function () {
	'use strict';
	/* Core.Component.Title Module */
	const ngModule = angular.module('core.component.title',[]);

	fwTitleWrapperDirective.init(ngModule);
	fwTitleDirective.init(ngModule);
	fwTitleButtonGroupDirective.init(ngModule);
	fwTitleButtonDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Title');
		$log.debug('ON.-');
	}
})();