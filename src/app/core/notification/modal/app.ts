/**
 * @author:			Ezequiel Mansilla
 * @description:	Modal
 * @type:			Module
 **/
import * as angular from 'angular';
import modalTypesConstant from "./modalTypesConstant";
import ModalService from "./ModalService";
import ModalController from "./ModalController";
import ModalConfirmSaveController from "./ModalConfirmSaveController";
import ModalValidarWarningController from "./ModalValidarWarningController";
import ModalSelectOptionController from "./ModalSelectOptionController";
import ModalTextAreaController from "./ModalTextAreaController";

import {ModalConfigOptionsComponent,ModalEditInputGenericoComponent,ModalOpenAuditoriaPorElementoComponent,ModalSuccessAnimationComponent, ModalInfoWithCallbackComponent} from "./components/";

(function () {
	'use strict';
	/* Core.Notification.Modal Module */
	const ngModule = angular.module('core.notification.modal',[]);

	modalTypesConstant.init(ngModule);
	ModalService.init(ngModule);
	ModalController.init(ngModule);
	ModalConfirmSaveController.init(ngModule);

	ModalValidarWarningController.init(ngModule);
	ModalSelectOptionController.init(ngModule);
	ModalTextAreaController.init(ngModule);

	ModalConfigOptionsComponent.init(ngModule);
	ModalEditInputGenericoComponent.init(ngModule);
	ModalOpenAuditoriaPorElementoComponent.init(ngModule);
	ModalSuccessAnimationComponent.init(ngModule);
	ModalInfoWithCallbackComponent.init(ngModule);
	
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Notification.Modal');
		$log.debug('ON.-');
	}

})();