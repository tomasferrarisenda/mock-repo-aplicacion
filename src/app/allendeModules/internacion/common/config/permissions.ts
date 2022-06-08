/**
 * @author:			Ezequiel Mansilla
 * @description:	Permisos para internados enteros
 * @type:			Constant
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_IMPRESION_INTERNADOS', {
			PREADMISION : 151,
			ADMISION : 153,
			INTERNADO : 152,

			MEDICO_PREADMISION: 145,
			PROTESIS_PREADMISION: 147,
			GUARDIA_PREADMISION: 146,
			ADMISION_PREADMISION : 148,
			ADMISION_ADMISION: 149,
			ADMISION_INTERNADO: 150	
		});
		
	};
	return module;

})();