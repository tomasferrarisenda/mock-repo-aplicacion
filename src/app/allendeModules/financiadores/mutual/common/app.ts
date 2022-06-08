/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo comun para mutual
 * @type:			Module
 **/
import * as angular from 'angular';
import MutualDataService from "./services/MutualDataService";
import {GrupoDeMutualesDataService} from './services/GrupoDeMutualesDataService';
import MutualLogicService from "./services/MutualLogicService";

import PlanMutualSelectorController from "./controllers/PlanMutualSelectorController";
import MutualSelectorController from "./controllers/MutualSelectorController";
import PlanMutualController from "./controllers/PlanMutualController";

import saMutual from "./directives/saMutual";
import saSelectorMutual from "./directives/saSelectorMutual";
import saPlanMutual from "./directives/saPlanMutual";
import saNewMutualSelector from "./directives/saNewMutualSelector";
import saMutualesPaciente from "./directives/saMutualesPaciente";
import saMutualPlanes from "./directives/saMutualPlanes";

(function () {
	'use strict';
	/* Mutual.Common Module */
	const module = angular.module('financiadores.mutual.common',[]);

	MutualDataService.init(module);
	MutualLogicService.init(module);
	GrupoDeMutualesDataService.init(module);
	PlanMutualSelectorController.init(module);
	MutualSelectorController.init(module);
	PlanMutualController.init(module);
	saMutual.init(module);
	saSelectorMutual.init(module);
	saPlanMutual.init(module);
	saNewMutualSelector.init(module);
	saMutualesPaciente.init(module);
	saMutualPlanes.init(module);

	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Financiadores.Common');
		$log.debug('ON.-');
	}
})();