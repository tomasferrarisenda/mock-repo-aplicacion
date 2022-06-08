/**
 * @author:			Ezequiel Mansilla
 * @description:	Permisos para preadmision
 * @type:			Constant
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_PREADMISION', {
			NEW: 1,
			LIST: 2,
			DELETE: 4,
			EDIT: 32,
			EDIT_CREATED: 3,
			EDIT_IN_PROCESS: 5,
			EDIT_PENDING: 6,
			EDIT_APRROVED: 7,
			EDIT_UNCONFORMITY: 8,
			EDIT_NULL: 9,
			
			NEW_NORMAL: 40,
			NEW_URGENTE_GUARDIA: 41,
			NEW_URGENTE_ART: 42,
			NEW_URGENTE_CE: 43,
			LIST_ALL: 44,
			LIST_PARAMS: 45,
			EDIT_CREADO: 47,
			EDIT_EN_PROCESO_INTERVENCION: 48,
			EDIT_EN_PROCESO_PROTESIS: 49,
			EDIT_EN_PROCESO_HUESOS: 50,
			EDIT_PENDIENTE_ESTERILIZACION: 55,
			EDIT_PENDIENTE_FARMACIA: 56,
			EDIT_APROBADO: 58,

			READMITIR: 276
		});

		module.constant('PERMISSION_LIST_PREADMISION', [
			{
				Id : 40,
				Nombre : 'PROGRAMADA',
				Color : 'btn-success',
				Descripcion : 'Opción para casos con fechas de internacion programadas',
				State : 'preadmision.new.normal',
				Icono : 'glyphicon glyphicon-calendar'
			},
			{
				Id : 41,
				Nombre : 'URGENTE - Guardia',
				Color : 'btn-danger',
				Descripcion : 'Opción para casos que requieran internación inmediada',
				State : 'preadmision.new.urgent.guardia',
				Icono : 'glyphicon glyphicon-download-alt'
			},
			{
				Id : 42,
				Nombre : 'URGENTE- ART',
				Color : 'btn-warning',
				Descripcion : 'Admitir paciente ART',
				State : 'preadmision.new.urgent.art',
				Icono : 'glyphicon glyphicon-plus'
			},
			{
				Id : 43,
				Nombre : 'URGENTE - Consultorio Externo',
				Color : 'btn-danger',
				Descripcion : 'Opción para casos que requieran internación inmediada',
				State : 'preadmision.new.urgent.consultorioexterno',
				Icono : 'glyphicon glyphicon-plus'
			},
			{
				Id : 47,
				Nombre : 'DATOS BÁSICOS',
				Color : 'btn-default',
				Descripcion : 'Edición de datos cargados por el médico',
				State : 'preadmision.edit.creado.do',
				Icono : 'glyphicon glyphicon-plus'
			},
			{
				Id : 48,
				Nombre : 'ADMISIÓN',
				Color : 'btn-info',
				Descripcion : 'Edición de admisión',
				State : 'preadmision.edit.proceso.intervencion',
				Icono : 'fa fa-wheelchair '
			},
			{
				Id : 49,
				Nombre : 'PRÓTESIS',
				Color : 'btn-default',
				Descripcion : 'Edición de admisión',
				State : 'preadmision.edit.proceso.protesis',
				Icono : 'fa fa-steam'
			},
			{
				Id : 50,
				Nombre : 'HUESOS',
				Color : 'btn-default',
				Descripcion : 'Edición de huesos',
				State : 'preadmision.edit.proceso.huesos',
				Icono : 'fa fa-steam'
			},
			{
				Id : 55,
				Nombre : 'ESTERILIZACIÓN',
				Color : 'btn-default',
				Descripcion : 'Edición de protesis esterilizacion',
				State : 'preadmision.edit.pendiente.esterilizacion',
				Icono : 'fa fa-steam'
			},
			{
				Id : 56,
				Nombre : 'FARMACIA',
				Color : 'btn-default',
				Descripcion : 'Edición de protesis farmacia',
				State : 'preadmision.edit.pendiente.farmacia',
				Icono : 'fa fa-steam'
			},
			{
				Id : 58,
				Nombre : 'CIRUGÍA',
				Color : 'btn-default',
				Descripcion : 'Edición de fecha de cirugía final',
				State : 'preadmision.edit.aprobado',
				Icono : 'fa fa-steam'
			}
		]);


		
	};
	return module;

})();