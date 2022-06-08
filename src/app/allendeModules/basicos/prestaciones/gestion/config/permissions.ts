/**
 * @author:			ppautasso
 * @description:	Permisos para abm de servcicios
 * @type:			Constant
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_PRESTACION', {

			NEW: 165 ,			
			EDIT: 166,
			VIEW : 168,
			DELETE: 167
			
						
		});
		
	};
	return module;

})();