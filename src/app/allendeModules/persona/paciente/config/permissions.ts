/**
 * @author:			hcastro
 * @description:	Permisos para abm de paciente
 * @type:			Constant
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_PACIENTE', {
			// LIST: 79,
			NEW: 101 ,			
			EDIT: 196,
			VIEW : '',
			DELETE: ''
			
						
		});
		
	};
	return module;
})();