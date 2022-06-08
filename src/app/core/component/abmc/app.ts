/**
 * @author:			Ezequiel Mansilla
 * @description:	ABMC genérico
 * @type:			Module
 **/
import * as angular from 'angular';
import "./container/app";
import "./action/app";
import "./model/app";
import "./render/app";

(function () {
	'use strict';
	/* Core.Component.Abmc Module */
	const ngModule = angular.module('core.component.abmc',[
			'core.component.abmc.container',
			'core.component.abmc.action',
			'core.component.abmc.model',
			'core.component.abmc.render'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Abmc');
		$log.debug('ON.-');
	}
})();