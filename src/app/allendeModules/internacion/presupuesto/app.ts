/**
 * @author:			Ezequiel Mansilla
 * @description:	Presupuestos de protesis
 * @type:			Module
 **/
import * as angular from 'angular';
import saPresupuestoProtesisListComponent from "./saPresupuestoProtesisList/saPresupuestoProtesisListComponent";
import saPresupuestoProtesisNewComponent from "./saPresupuestoProtesisNew/saPresupuestoProtesisNewComponent";
import saPresupuestoProtesisEditComponent from "./saPresupuestoProtesisEdit/saPresupuestoProtesisEditComponent";
import saPresupuestoProtesisPrintComponent from "./saPresupuestoProtesisPrint/saPresupuestoProtesisPrintComponent";
import PresupuestoProtesisDataService from "./services/PresupuestoProtesisDataService";
import PresupuestoProtesisLogicService from "./services/PresupuestoProtesisLogicService";

(function () {
	'use strict';
	/* Internacion.Presupuesto Module */
	const module = angular.module('internacion.presupuesto',[]);

	saPresupuestoProtesisListComponent.init(module);
	saPresupuestoProtesisNewComponent.init(module);
	saPresupuestoProtesisEditComponent.init(module);
	saPresupuestoProtesisPrintComponent.init(module);
	
	PresupuestoProtesisDataService.init(module);
	PresupuestoProtesisLogicService.init(module);
	
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Internacion.Presupuesto');
		$log.debug('ON.-');
	}
})();