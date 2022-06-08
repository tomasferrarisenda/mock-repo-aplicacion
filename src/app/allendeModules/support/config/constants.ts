/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('SUCURSAL', [
			{
				rol: 'SanatorioAllende-NuevaCordoba',
				descripcion: 'NUEVA CBA',
				suc: 1,
				id_sucursal : 1
			},
			{
				rol: 'SanatorioAllende-Cerro',
				descripcion: 'CERRO',
				suc: 2,
				id_sucursal : 2
			}
		]);
	};
	return module;

})();