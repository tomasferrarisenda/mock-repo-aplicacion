/**
 * @author:			jbasiluk
 * @description:	Permisos para configuraciones
 * @type:			Constant
 */
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_CONFIGURACIONES', {
			LIST: 210		
		});

		
	};
	return module;
})();