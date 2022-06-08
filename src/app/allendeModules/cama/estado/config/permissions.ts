/**
 * @author:			Ezequiel Mansilla
 * @description:	Permisos para estados de cama
 * @type:			Constant
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_CAMA_ESTADOS', {
			// LIST: 11,
			LIST_ALL: 74,
			LIST_LIMPIEZA: 72,
			LIST_MANTENIMIENTO: 73
		});
		
	};
	return module;

})();