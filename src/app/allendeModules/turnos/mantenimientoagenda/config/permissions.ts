/**
 * @author:			ppautasso
 * @description:	Permisos para abm de feriados
 * @type:			Constant
 */
export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_FERIADO', {
			// LIST: 127,
			NEW: 99 ,			
			EDIT: 99,
			
			DELETE: 174,
			APLICAR : 175,
			ANULAR: 175
			
						
		});

		module.constant('PERMISSION_RECESO', {
			// LIST: 127,
			NEW: 100 ,			
			EDIT: 100,
			
			DELETE: 176,
			APLICAR : 177,
			ANULAR: 177
			
			
						
		});
		
	};
	return module;
})();
