/**
 * @author:			ppautasso
 * @description:	Permisos para asignacion de turnos
 * @type:			Constant
 */
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_ASIGNACION_TURNOS', {
			LIST: 188,
			// NEW: 183,			
			// EDIT: 179,
			// DELETE: 182,
			// APLICAR : 180,
			// VIEW: 181
						
		});


	};
	return module;
})();
