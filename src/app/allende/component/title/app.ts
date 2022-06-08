/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de manejo de titulos allende
 * @type:			Module
 **/
import * as angular from 'angular';
import saTitleDirective from './saTitleDirective';
import ButtonService from './ButtonService';

(function () {
	'use strict';
	/* Allende.Component.Title Module */
		const ngModule = angular.module('allende.component.title',[]);

		saTitleDirective.init(ngModule);
		ButtonService.init(ngModule);
		ngModule.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance('Allende.Component.Title');
			$log.debug('ON.-');
		}
})();