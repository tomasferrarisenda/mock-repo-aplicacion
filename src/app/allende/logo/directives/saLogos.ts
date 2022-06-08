/**
 * @author 			emansilla
 * @description 	description
 */
import logoTemplate = require("../templates/sa-logo.html");
import logoMinTemplate = require("../templates/sa-logo-min.html");
import logoGrandeTemplate = require("../templates/sa-logo-grande.html");
import logoAplicacionesTemplate = require("../templates/sa-logo-aplicaciones.html");

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saLogo', saLogo);
		ngModule.directive('saLogoMin', saLogoMin);
		ngModule.directive('saLogoGrande', saLogoGrande);
		ngModule.directive('saLogoAplicaciones', saLogoAplicaciones);

		saLogo.$inject = [];
		function saLogo () {
			return {
				restrict : 'E',
				template : logoTemplate
			};
		}

		saLogoMin.$inject = [];
		function saLogoMin () {
			return {
				restrict : 'E',
				template : logoMinTemplate
			};
		}

		saLogoGrande.$inject = [];
		function saLogoGrande () {
			return {
				restrict : 'E',
				template : logoGrandeTemplate
			};
		}

		saLogoAplicaciones.$inject = [];
		function saLogoAplicaciones () {
			return {
				restrict : 'E',
				template : logoAplicacionesTemplate
			};
		}
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación 
	// y el del link después

	return module;

})();