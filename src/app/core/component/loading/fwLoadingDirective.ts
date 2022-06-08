/**
 * @author 			emansilla
 * @description 	description
 */
import fwLoadingTemplate = require("./fw-loading.tpl.html");
import fwLoadingPageTemplate = require("./fw-loading-page.tpl.html");
import fwLoadingMinTemplate = require("./fw-loading-min.html");
import fwLoadingChristmasTemplate = require("./fwLoadingChristmas.html");
import fwLoadingSpinnerTemplate = require("./fwLoadingSpinner.html");
import fwLoadingMundialTemplate = require("./fwLoadingMundial.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Loading de sistema.
		ngModule.directive('saLoading', fwLoading);
		ngModule.directive('saLoadingPage', fwLoadingPage);
		ngModule.directive('saLoadingMin', fwLoadingMin);
		ngModule.directive('saLoadingModal', fwLoadingModal);

		ngModule.directive('fwLoading', fwLoading);
		ngModule.directive('fwLoadingPage', fwLoadingPage);
		ngModule.directive('fwLoadingMin', fwLoadingMin);
		ngModule.directive('fwLoadingModal', fwLoadingModal);

		// fwLoading.$inject = [''];
		function fwLoading () : any {
			return {
				restrict : 'E',
				template : fwLoadingTemplate,
				link: link
			};

			function link (scope, element, attrs) {
				scope.label = attrs.label || 'Aguarde unos segundos.';
				scope.templateChristmas = fwLoadingChristmasTemplate;
				scope.templateSpinner = fwLoadingSpinnerTemplate;
				scope.fwLoadingMundial = fwLoadingMundialTemplate;
				
			}
		}

		fwLoadingModal.$inject = ['ModalService'];
		function fwLoadingModal(ModalService: IModalService): any {
			return {
				restrict: 'E',
				link: link
			};

			function link(scope, element, attrs) {

				ModalService.loadingOpen();
				scope.label = attrs.label || 'Aguarde unos segundos.';

				scope.$on('$destroy', () => {
					ModalService.loadingClose();
				})
			}
		}

		// fwLoadingPage.$inject = [''];
		function fwLoadingPage () : any {
			return {
				restrict : 'E',
				template : fwLoadingPageTemplate
			};
		}

		// fwLoadingMin.$inject = [''];
		function fwLoadingMin () : any {
			return {
				restrict : 'E',
				template :fwLoadingMinTemplate
			};	
		}
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación y
	// el del link después

	return module;

})();