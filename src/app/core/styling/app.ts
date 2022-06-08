/**
 * @author:			Ezequiel Mansilla
 * @description:	Styling general
 * @type:			Module
 **/
import * as angular from 'angular';
import './button/app';
import { InvertColor } from './invertColorDirective';
(function () {
	'use strict';
	
	/* Core.Styling Module */
	const ngModule = angular.module('core.styling', [
			'core.styling.button'
		]);

	ngModule.run(run);
	InvertColor.init(ngModule);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Styling');
		$log.debug('ON.-');
	}

})();