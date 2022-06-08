/**
 * @author:			ppautasso
 * @description:	Permisos para homologaciones
 * @type:			Constant
 */
export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_AUTORIZADORES', {

			//DELETE: 131,
			EDIT: 156,
			DELETE_ITEM : 170
		
		});

		
	};
	return module;
})();