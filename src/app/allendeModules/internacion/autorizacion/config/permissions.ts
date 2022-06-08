/**
 * @author:			Ezequiel Mansilla
 * @description:	Permisos para autorizacion de internado
 * @type:			Constant
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_AUTORIZACION_INTERNADO', {
			NEW: 140,
			EDIT: 144,
			EDIT_GESTION : 141,
			EDIT_AUTORIZADO : 142,
			VIEW : 143
		});
		
	};
	return module;

})();