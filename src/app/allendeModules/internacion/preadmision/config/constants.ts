/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		// module.constant('DIFICULTAD_GESTION', {
		// 	MUY_PROBABLE: 'MUY PROBABLE',
		// 	PROBABLE: 'PROBABLE',
		// 	POCO_PROBABLE: 'POCO PROBABLE',
		// 	MUY_COMPLICADO: 'MUY COMPLICADO'
		// });

		module.constant('ESTADO_SOLICITUD', {
			CREADO: 'CREADO',
			EN_PROCESO: 'EN PROCESO',
			NO_CONFORMIDAD: 'NO CONFORMIDAD',
			ANULADO: 'ANULADO',
			EN_CIRUGIA: 'APROBADO',
			APROBADO: 'APROBADO',
			PENDIENTE: 'PENDIENTE'
		});

		module.constant('ACTION_PREADMISION', {
			INIT: '/Internacion/Preadmision',
			DEFAULT: 'Preadmision/List/All',
			NEW_NORMAL: '/Internacion/Preadmision/New/Normal',
			NEW_URGENTE_GUARDIA: '/Internacion/Preadmision/New/Urgent/Guardia',
			NEW_URGENTE_CE: '/Internacion/Preadmision/New/Urgent/ConsultorioExterno',
			NEW_ART: '/Internacion/Preadmision/New/Urgent/Art',
			LIST: '/Internacion/Preadmision/List/All',
			LIST_PARAMS: '/Internacion/Preadmision/List/Params',
			DELETE: '/Internacion/Preadmision/Delete/Do',
			EDIT_CREADO: '/Internacion/Preadmision/Edit/DoCreate',
			EDIT_EN_PROCESO_INTERVENCION: '/Internacion/Preadmision/Edit/DoInProcess/Intervencion',
			EDIT_EN_PROCESO_PROTESIS: '/Internacion/Preadmision/Edit/DoInProcess/Protesis',
			EDIT_EN_PROCESO_HUESOS: '/Internacion/Preadmision/Edit/DoInProcess/Huesos',
			// EDIT_NO_CONFORMIDAD: '/Internacion/Preadmision/Edit/DoUnconformity',
			EDIT_PENDIENTE: '/Internacion/Preadmision/Edit/DoPending',
			EDIT_PENDIENTE_FARMACIA: '/Internacion/Preadmision/Edit/DoPending/Farmacia',
			EDIT_APROBADO: '/Internacion/Preadmision/Edit/DoApproved'
		});	
	};
	
	return module;

})();