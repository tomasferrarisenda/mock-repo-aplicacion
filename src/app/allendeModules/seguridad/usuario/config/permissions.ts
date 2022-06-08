/**
 * @author:			ppautasso
 * @description:	Permisos para abm de usuarios
 * @type:			Constant
 */
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_USUARIO', {
			LIST: 126,
			NEW: 129,
			DELETE: 131,
			EDIT: 130,
			VIEW: 132,
			ASIGNAR_USUARIO: 133,
			ASIGNAR_ROL_USUARIO: 136,
			ASIGNAR_EXCEP_USUARIO: 137
						
		
		});

		module.constant('PERMISSION_LIST_USUARIOS', [
			{
				Id : 136,
				Nombre : 'ASIGNAR ROL A USUARIO',
				Color : 'btn-success',
				Descripcion : 'Opcion para asignar roles a un usuario especifico',
				State : 'usuario.gestion.asignarRol',
				Icono : 'glyphicon glyphicon-user'
			},
			{
				Id : 137,
				Nombre : 'ASIGNAR EXCEPCION A USUARIO',
				Color : 'btn-info',
				Descripcion : 'Opción para asignar excepciones a un usuario especifico',
				State : 'usuario.gestion.asignarExcep',
				Icono : 'glyphicon glyphicon-remove-sign'
			}
		]);


		
	};
	return module;
})();
