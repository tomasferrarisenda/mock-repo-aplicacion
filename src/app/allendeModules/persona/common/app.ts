
import * as angular from 'angular';

import PacienteStorageHelperService from "./services/PacienteStorageHelperService";

(function () {
   'use strict';
   
		/* System.Common Module */
        const module = angular.module('persona.common',['persona.common']);
        
		PacienteStorageHelperService.init(module);		

		module.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance("Persona.Common");
			//$log.debug('ON.-');
		}
	})();