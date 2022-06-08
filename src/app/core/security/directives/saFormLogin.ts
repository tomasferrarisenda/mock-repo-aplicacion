/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para formulario login
 * @type:			Directive
 **/
import * as angular from 'angular';
import saFormLoginTemplate = require("../templates/sa-form-login.tpl.html");

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saFormLogin', saFormLogin);

		saFormLogin.$inject = ['$log'];
		function saFormLogin ($log) : any {
			return {
				restrict : 'E',
				scope : {
					username : '=',
					password : '=',
					loading : '=?',
					usernameDisabled : '=?'
				},
				replace : true,
				template : saFormLoginTemplate,
				link: function (scope, element, attrs) {
					// $('#password').keypress(e => {
					// 	var s = String.fromCharCode(e.which);
					// 	if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
					// 		alert('caps is on');
					// 	}
					// });
					scope.showIsCapLock = false;
					scope.isCapslock = isCapslockFn;
					scope.sinDatos = 'Sin datos';
					scope.usernameDisabled = angular.isUndefined(attrs.usernameDisabled) ? false : scope.usernameDisabled;

					function isCapslockFn(e) {
						scope.showIsCapLock = isCapslock(e);
					}
				}
			};
			function isCapslock(e) {
	
				e = (e) ? e : window.event;
	
				var charCode: any = false;
				if (e.which) {
					charCode = e.which;
				} else if (e.keyCode) {
					charCode = e.keyCode;
				}
	
				var shifton = false;
				if (e.shiftKey) {
					shifton = e.shiftKey;
				} else if (e.modifiers) {
					shifton = !!(e.modifiers & 4);
				}
	
				if (charCode >= 97 && charCode <= 122 && shifton) {
					return true;
				}
	
				if (charCode >= 65 && charCode <= 90 && !shifton) {
					return true;
				}
	
				return false;
	
			}
		}

	};

	return module;

})();