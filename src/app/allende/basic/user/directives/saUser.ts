/**
 * @author:			Ezequiel Mansilla
 * @description:	Datas de usuario
 * @type:			Directive
 **/
import templateUser = require("../templates/sa-user.tpl.html")
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };
	
	module.init = function (ngModule) {

		ngModule.directive('saUser', saUser);

		saUser.$inject = ['$log', '$location', 'DEBUG', 'SecurityLogicService'];
		function saUser ($log, $location, DEBUG, SecurityLogicService) {
			return {
				restrict : 'E',
				scope : {
					model : '='
				},
				template : templateUser,
				link : link
			};

			function link (scope, element, attrs) {
				scope.debug = DEBUG;
				scope.changePassword = changePassword;
			}

			function changePassword(userName) {
				SecurityLogicService.ChangePassword(userName)
					.then(function (pUsername) {
						$location.path('/Login');
						$('#password').focus();
					});
			}
		}
	};

	return module;
})();