/**
 * @author:			ppautasso
 * @description:	Permisos para abm de plantillas
 * @type:			Constant
 */
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_PLANTILLA', {
			// LIST: 127,
			NEW: 191,			
			EDIT: 192,
			DELETE: 193,
			APLICAR : 195,
			VIEW: 194,
			COPY: 254,
			LIST: 253,
			EDIT_OBSERVACION_INTERNA: 255,
			EDIT_OBSERVACION_PORTAL: 256,
			REGLA_DURACION_TURNOS: 257,
			REGLA_CANTIDAD_TURNOS: 258
						
		});


	};
	return module;
})();
