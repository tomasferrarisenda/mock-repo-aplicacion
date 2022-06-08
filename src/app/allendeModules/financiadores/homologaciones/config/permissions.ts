/**
 * @author:			ppautasso
 * @description:	Permisos para homologaciones
 * @type:			Constant
 */
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_HOMOLOGACIONES', {

			//DELETE: 131,
			EDIT: 157
			
		
		});

		
	};
	return module;
})();