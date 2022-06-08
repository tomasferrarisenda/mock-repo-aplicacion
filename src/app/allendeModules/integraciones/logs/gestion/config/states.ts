/**
 * @author 			jbasiluk
 * @description 	description
 */
import logsTemplate = require('../views/logs-gestion-list.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			
			$stateProvider.state({
				name: 'integraciones.logs.gestion',
				url : '/Gestion',
				template: logsTemplate,
				controller: 'LogsGestionController',
				controllerAs: 'vm',
				data : {
					idPermiso: 204,
					title: 'Lista de logs en bandejas',
					icon: 'LIST',
					module: 'INTEGRACIONES'
				}
			});

		}
	};

	return module;
})();