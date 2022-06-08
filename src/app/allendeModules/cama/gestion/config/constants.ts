/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_CAMA_GESTION', {
			INIT : '/Cama/Gestion',
			// DEFAULT : 'Cama/List',
			NEW : '/Cama/Gestion/New',
			LIST : '/Cama/Gestion/List',
			LIST_ALL : '/Cama/Gestion/List/All',
			// LIST_LIMPIEZA : '/Cama/List/Limpieza',
			// LIST_MANTENIMIENTO : '/Cama/List/Mantenimiento',
			DELETE : '/Cama/Gestion/Delete',
			EDIT : '/Cama/Gestion/Edit'
		});

		module.constant('HABITACION_ORDER', [
			{
				id : 1,
				value : 'Numero',
				descripcion : 'Habitación (Asc)',
				reverse : false
			},
			{
				id : 2,
				value : 'Numero',
				descripcion : 'Habitación (Desc)',
				reverse : true
			}
		]);

	};

	return module;
})();
