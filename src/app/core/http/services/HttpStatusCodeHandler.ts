/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('HttpStatusCodeHandler', HttpStatusCodeHandler);

		HttpStatusCodeHandler.$inject = ['HTTP_METHOD', 'HTTP_STATUS_CODE'];
		
		function HttpStatusCodeHandler (HTTP_METHOD, HTTP_STATUS_CODE) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('HttpStatusCodeHandler');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				GetMessageByCode : GetMessageByCode
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function GetMessageByCode(pError, pReason) {
				var _mensaje,
					_errorCode = ' [' + pError + ']';

				switch(pError) {
					case HTTP_STATUS_CODE.OK:
						_mensaje = 'OK.';
						break;
					case HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR:
						_mensaje = 'Se produjo un error en el servidor.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.NOT_FOUND:
						_mensaje = 'Petición no disponible.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.BAD_REQUEST:
						_mensaje = 'Solicitud incorrecta.';
						break;
					case HTTP_STATUS_CODE.TOKEN_CHANGE:
						_mensaje = 'El token de acceso ha caducado. Inicie sesión nuevamente.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.UNAUTHORIZED:
						_mensaje = 'Usuario y/o contraseña incorrecta.';
						break;
					case HTTP_STATUS_CODE.SERVICE_UNAVAILABLE:
						_mensaje = 'El servidor está realizando tareas de mantenimiento o está congestionado. Intente en 2 minutos.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.NO_CONTENT:
						_mensaje = 'No hay registros que coincidan con la búsqueda. ';
						break;
					case HTTP_STATUS_CODE.BAD_GATEWAY:
						_mensaje = 'Problema de resolución de proxy.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.METHOD_NOT_ALLOWED:
						_mensaje = 'Método HTTP no permitido.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.UNREACHABLE:
						_mensaje = 'Falló la conexion con el servidor.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.UNKNOWN:
						_mensaje = 'Falló la conexion con el servidor.' + _errorCode;
						break;
					case HTTP_STATUS_CODE.CONFLICT:
						_mensaje = pReason + _errorCode;
						break;
					default:
						_mensaje = 'Error contra el servidor no controlado.' + _errorCode;
						break;
				}

				// _mensaje += ' [' + pError + ']';

				return _mensaje;
			}
		};
	};

	return module;
})();