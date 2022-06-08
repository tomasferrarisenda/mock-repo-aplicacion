/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.constant('ERROR_MESSAGE' ,{
			WRONG: 'Error de inicio de sesion. Nombre de usuario y/o contraseña incorrectos',
			DISABLED: 'Error de inicio de sesion. La cuenta se encuentra deshabilitada',
			BLOCKED: 'Error de inicio de sesion. La cuenta se encuentra bloqueada',
			CHANGE: 'Error de inicio de sesion. Debe cambiar su clave para continuar...',
			TEST: 'Error de inicio de sesion. Este usuario es solo para pruebas',
			DEFAULT: 'Error de inicio de sesion. Falló la conexion con el servidor.',
			CONECTION: 'Error en cambio de clave. Error de coneccion con Active Directory',
			INVALID: 'Error en cambio de clave. La contraseña ingresada no es válida',
			SHORT: 'Error en cambio de clave. La contraseña ingresada no cumple los requisitos de longitud',
			CURRENT: 'Error en cambio de clave. Nombre de usuario y/o contraseña incorrectos',
			RESTRICTION: 'Error en cambio de clave. La contraseña ingresada no cumple con los requisitos',
			REPEAT: 'Error en cambio de clave. Las contraseñas no coinciden.'
		});

	};
	return module;
})();