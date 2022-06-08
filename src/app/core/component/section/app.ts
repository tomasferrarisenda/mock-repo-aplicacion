/**
 * @author:			Pablo Pautasso
 * @description:	Section App 
 * @type:			Module
 **/
import * as angular from 'angular';

import saSectionDirective from "./saSectionDirective";
import saSectionItem from "./saSectionItem";
import saSectionLeftDirective from "./saSectionLeftDirective";
(function () {
	'use strict';
	/* Core.Component.Body Module */
	const ngModule = angular.module('core.component.section',[]);

	saSectionDirective.init(ngModule);
	saSectionItem.init(ngModule);
	saSectionLeftDirective.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Section');
		$log.debug('ON.-');
	}
})();