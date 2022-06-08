/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

// Services
import ProfesionalLogicService from "./services/ProfesionalLogicService";

// Controllers
import ProfesionalListController from "./controllers/ProfesionalListController";

// Directives
import saProfesionalBasic from "./directives/saProfesionalBasic";

(function () {
	'use strict';
	/* Persona.Profesional Module */
	const module = angular.module('persona.profesional',[]);

	ProfesionalLogicService.init(module);
	ProfesionalListController.init(module);

	saProfesionalBasic.init(module);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Persona.Profesional');
		$log.debug('ON.-');
	}]);
})();