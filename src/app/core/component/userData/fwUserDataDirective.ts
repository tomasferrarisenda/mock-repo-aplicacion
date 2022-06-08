/**
 * @author:			Ezequiel Mansilla
 * @description:	Datos del usuario para login
 * @type:			Directive
 **/
import fwUserDataTemplate = require("./fw-user-data.tpl.html");
import { ICredentialsDataService } from "core/security";

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saUserData', fwUserData);
		ngModule.directive('fwUserData', fwUserData);

		fwUserData.$inject = ['CredentialsDataService', 'ENV'];
		function fwUserData(CredentialsDataService: ICredentialsDataService, ENV) : any {
			return {
				restrict : 'E',
				replace : true,
				template : fwUserDataTemplate,
				link: link
			};

			function link (scope, element) {

				scope.irAMisDatosV2 = irAMisDatosV2;

				function irAMisDatosV2() {
					window.location.href = `${ENV.APP2}/user/misDatos`;
				}

				scope.classHeader = ENV.CLASS;
				if (scope.classHeader == 'production') { 
					scope.whiteClass = true;
				}

				CredentialsDataService.Get()
				.then(getUserOk, getUserError);

				function getUserOk (pUser) {
					scope.show = true;
					scope.userName = pUser.name || pUser.userName;
				}

				function getUserError (pError) {
					scope.error = true;
					scope.show = false;
				}

			}
		}
	};

	return module;

})();