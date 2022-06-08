/**
 * @author:			Javier Delmastro
 * @description:	
 * @type:			Service
 **/

import turnoLogAuditoriaViewTemplate = require('../templates/turno-log-auditoria.tpl.html');


export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('TurnosLogicService', TurnosLogicService);
		TurnosLogicService.$inject = ['Logger', '$uibModal'];
        
        function TurnosLogicService($log, $uibModal) {
			$log = $log.getInstance('TurnosLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				verLogDeAuditoria: verLogDeAuditoria,				
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function verLogDeAuditoria(pIdTurno) {
				return $uibModal.open({
					template: turnoLogAuditoriaViewTemplate,
					controller: 'TurnoLogAuditoriaController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						IdTurno: function() { return pIdTurno; },
						Title: function() { return 'Auditoría de cambios de estados del Turno'; }
					}
				}).result;
			}

		}
	};

	return module;
})();