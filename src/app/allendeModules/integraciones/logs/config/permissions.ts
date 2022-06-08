/**
 * @author:			jbasiluk
 * @description:	Permisos visualizacion de logs de integraciones
 * @type:			Constant
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_LOGS', {
			LIST: 204	
		});
		
	};
	return module;
})();