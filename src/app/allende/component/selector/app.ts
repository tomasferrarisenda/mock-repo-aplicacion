/**
 * @author:			Pablo Pautasso
 * @description:	Selector generico con data ModalService
 * @type:			Module
 **/
import * as angular from 'angular';
import SelectorService from "./SelectorService";
import SelectorController from"./SelectorController";

(function () {
	'use strict';
	/* Core.Notification.Modal Module */
	const ngModule = angular.module('allende.component.selector',[]);
	
	SelectorService.init(ngModule);
	SelectorController.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Component.Selector');
		$log.debug('ON.-');
	}
})();