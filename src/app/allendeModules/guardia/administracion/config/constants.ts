export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		// Reemplazar NOMBRE_MODULO por el nombre del modulo real
		//  Ejemplo: TITLE_ADMISION
		module.constant('TITLE_ADMINISTRACION', {
			MODULE: 'GUARDIA', // ADMISION
			LIST: 'Listado de Pacientes',
			DETALLE: 'Detalle del Paciente'
		});

		// module.constant('ACTION_ADMINISTRACION', {
		// 	INIT : '/Guardia/Administracion',
		// 	DEFAULT : '/Guardia/Administracion/List',
		// 	LIST: '/Guardia/Administracion/List'
		// });

		// module.constant('ROL_ADMINISTRACION', {
		// 	ADMIN: 'Guardia-Administracion-Administrador',
		// 	SECRETARIA: 'Guardia-Administrativo'
		// });


	};

	return module;
})();
