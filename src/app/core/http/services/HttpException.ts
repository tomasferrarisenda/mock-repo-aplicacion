
/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(httpException);

		httpException.$inject = ['$httpProvider'];
		function httpException($httpProvider) {
			$httpProvider.interceptors.push('HttpException');
		}

		ngModule.factory('HttpException', HttpException);

		HttpException.$inject = ['$q', '$exceptionHandler', 'HttpStatusCodeHandler', 'AllendeException',
			'HTTP_STATUS_CODE', '$injector'];
		
		function HttpException ($q, $exceptionHandler, HttpStatusCodeHandler, AllendeException,
			HTTP_STATUS_CODE, $injector) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('HttpException');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var isRefreshingToken;

			const service = {
				response : response,
				responseError : responseError
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function response (response) {
				// A response status code between 200 and 299 is considered a success status and will result in the success 
				// callback being called

				if (response.status !== HTTP_STATUS_CODE.OK) {
					var message = createMessage(response);
					var error = new AllendeException(message, 'http', false);
					$exceptionHandler(error);
					return $q.reject(response);
				}

				return $q.when(response);
			}

			/**
			* @ngdoc function
			* @name HttpException#responseError
			* @methodOf weatherApp.blocks.http.service:HttpException
			*
			* @description
			* Handles all HTTP responses with error.
			*
			* @param {Object} rejection - Object with information about the error.
			*/
			// function responseError (rejection) {
			// 	var message = createMessage(rejection);
			// 	var block =(rejection.data && rejection.data.error_uri == 'true' ) ? false : true;
			// 	var error = new AllendeException(message, 'http', block);
			// 	error.status = rejection.status;
			// 	error.data = rejection.data;
			// 	$exceptionHandler(error, rejection);
			// 	return $q.reject(error);
			// }

			function createMessage (rejection) {
				var message = HttpStatusCodeHandler.GetMessageByCode(rejection.status, rejection.statusText);

				if (rejection.data) {
					message = rejection.data.Message || rejection.data.error_description || message;
				}

				return message;
			}

	
			function responseError(response) {
				switch (response.status) {
					/*
					* Tenemos dos posibilidades al obtener error
					* Error 401 :
					* => Se nos vencio el refreshToken, tenemos que obtener otro refreshToken y actualizar las credenciales
					* => Con ese nuevo refreshToken podemos seguir haciendo request
					* Error 400 :
					* => No estamos autenticados, debemos cerrar sesion e ir al login
					*/
					case 401:
						var deferred = $q.defer();
						// Consultamos si estamos refrescando el token
						if (!isRefreshingToken) {
							// no estoy refrescando el token debo ir a buscar un refreshtoken
							let _sto = $injector.get("StorageService").get('globals');
							var data = {
								IdEmpresa: _sto.currentUser.empresas.find(x => x.PorDefecto).IdEmpresa,
								authData: {
									accessToken: _sto.currentUser.fr._fra,
									refreshToken: _sto.currentUser.fr._frr
								}
							}

							isRefreshingToken = $injector.get("SecurityDataService").RefreshToken(data)
						}
						isRefreshingToken.then(function (r) {
									
							isRefreshingToken = null;
							if (r.Access_token && r.Refresh_token && r.CompanyId) {
								//debo actualizar los datos de acceso
								$injector.get("CredentialsDataService").Update(r);
								$injector.get("$http")(response.config).then(function (resp) {
									deferred.resolve(resp);
								}, function (resp) {
									deferred.reject();
								});
							} else {
								deferred.reject();
							}
						}, function (response) {
							//quise pedir refreshToken pero obtuve 400 
							//debo desloguearme
							isRefreshingToken = null;
							deferred.reject();
						
						});
						return deferred.promise;
						break;
					default:
						isRefreshingToken = null;
						var message = createMessage(response);
						var block =(response.data && response.data.error_uri == 'true' ) ? false : true;
						var error = new AllendeException(message, 'http', block);
						error.status = response.status;
						error.data = response.data;
						$exceptionHandler(error, response);
						return $q.reject(error);
						break;
				}
				return response || $q.when(response);
			}

		}
	};

	return module;
})();