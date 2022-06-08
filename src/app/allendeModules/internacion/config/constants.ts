/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ESTADO_PREADMISION', {
			CREADO : 'CREADO',
			EN_PROCESO : 'EN PROCESO',
			NO_CONFORMIDAD : 'NO CONFORMIDAD',
			ANULADO : 'ANULADO',
			EN_CIRUGIA : 'APROBADO',
			PENDIENTE: 'PENDIENTE'
		});

		module.constant('ESTADO_INTERNACION', {
			ADMITIDO : 43,
			PENDIENTE : 92,
			DE_ALTA : 44,
			ANULADO : 111
		});
	};
	
	return module;
})();