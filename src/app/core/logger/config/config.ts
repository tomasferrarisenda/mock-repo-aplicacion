/**
 * @author:			Ezequiel Mansilla
 * @description:	Configuración para mostrar o no mensajes de debug.
 * @type:			Config
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// La habilitacion/deshabilitacion se realiza desde app.conf.js

		/* Configuración de log */
		ngModule.config(configLog);

		configLog.$inject = ['$logProvider', 'DEBUG'];
		function configLog ($logProvider, DEBUG) {
			$logProvider.debugEnabled(DEBUG);
			// LoggerProvider.enabled(true);
		}
	};

	return module;

})();