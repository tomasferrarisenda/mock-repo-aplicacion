export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		// Reemplazar NOMBRE_MODULO por el nombre del modulo real
		//  Ejemplo: TITLE_ADMISION
		module.constant('TITLE_ATENCION', {
			MODULE: 'GUARDIA', 
			LIST: 'Listado de Pacientes',
			NEW: 'Carga de Indicaciones',
			EDIT: 'Realizar Indicaciones',
			ALTA: 'Alta de Paciente',
			NEW_FOJA: 'Carga de Fojas',
			PEDIDO_URGENCIA: 'Pedido a Farmacia'
		});

		module.constant('ACTION_ATENCION', {
			INIT : '/Guardia/Atencion',
			DEFAULT : '/Guardia/Atencion/List',
			LIST: '/Guardia/Atencion/List',
			NEW_FOJA: '/Guardia/Atencion/Foja',
			NEW: '/Guardia/Atencion/New',
			EDIT: '/Guardia/Atencion/Edit',
			ALTA: '/Guardia/Atencion/Alta',
			NEW_PARAMS: '/Guardia/New/Params',
			PEDIDO_URGENCIA: '/Guardia/Atencion/Urgencia'
		});

		module.constant('ROL_ATENCION', {
			ADMIN: 'Guardia-Atencion-Administrador',
			MEDICO: 'Guardia-Medico',
			MEDICO_SUPERVISOR: 'Guardia-Medico-Supervisor',
			ENFERMERA: 'Guardia-Enfermera'
		});


	};

	return module;
})();
