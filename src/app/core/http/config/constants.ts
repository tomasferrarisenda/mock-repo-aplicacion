/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.constant('HTTP_METHOD', {
			GET: 'GET',
			POST: 'POST',
			PUT: 'PUT',
			DELETE: 'DELETE'
		});
		
		ngModule.constant('HTTP_STATUS_CODE', {
			OK : 200,
			NO_CONTENT : 204,
			BAD_REQUEST : 400,
			UNAUTHORIZED : 401,
			FORBIDDEN : 403, 
			NOT_FOUND : 404,
			METHOD_NOT_ALLOWED : 405,
			CONFLICT : 409,
			INTERNAL_SERVER_ERROR : 500,
			BAD_GATEWAY : 502,
			SERVICE_UNAVAILABLE : 503,
			TOKEN_CHANGE : 600,
			UNKNOWN : -1,
			UNREACHABLE : 0
		});
	};

	return module;

})();