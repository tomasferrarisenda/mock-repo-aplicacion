/**
 * @author:			ppautasso
 * @description:	Permisos para abm de servcicios
 * @type:			Constant
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_SERVICIO', {
			// LIST: 127,
			NEW: 159 ,			
			EDIT: 160,
			VIEW : 161,
			DELETE: 162,
			ASIGNAR : 163
			
						
		});
		
	};
	return module;

})();