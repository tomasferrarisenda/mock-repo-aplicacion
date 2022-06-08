/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_SERVICIOS_ESPECIALIDAD', {
			INIT : '/Servicios/Especialidad',

			NEW : '/Servicios/Gestion/New',
			LIST : '/Servicios/Especialidad/List',
			LIST_ALL : '/Servicios/Especialidad/List/All',
	
			DELETE : '/Servicios/Gestion/Delete',
			EDIT : '/Servicios/Gestion/Edit'
		});



		module.constant('PERMISSION_SERVICIOS', {
			NEW: 'New',
			LIST: 'List',
			DELETE: 'Delete',
			EDIT: 'Edit'
		});

		// module.constant('HABITACION_ORDER', [
		// 	{
		// 		id : 1,
		// 		value : 'Numero',
		// 		descripcion : 'Habitación (Asc)',
		// 		reverse : false
		// 	},
		// 	{
		// 		id : 2,
		// 		value : 'Numero',
		// 		descripcion : 'Habitación (Desc)',
		// 		reverse : true
		// 	}
		// ]);

	};

	return module;
})();