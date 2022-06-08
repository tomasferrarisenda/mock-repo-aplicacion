/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

// Services
import { PersonaDataService, PersonaLogicService } from "./services";
import PersonaAuthService from "./services/PersonaAuthService";

// Controlelrs
import PersonaNewController from "./controllers/PersonaNewController";

// Directives
import saPersonaBasic from "./directives/saPersonaBasic";

(function () {
	'use strict';
	/* Persona.Prospecto Module */
	const module = angular.module('persona.prospecto',[]);

	// Services
	PersonaDataService.init(module);
	PersonaLogicService.init(module);
	PersonaAuthService.init(module);

	// Controllers
	PersonaNewController.init(module);

	// Directives 
	saPersonaBasic.init(module);
	
	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Persona.Prospecto');
		$log.debug('ON.-');
	}]);
})();