/**
 * @author:			Ezequiel Mansilla
 * @description:	Validar refresco con tecla F5
 * @type:			Directive
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saValidRefresh', fwValidRefresh);
		ngModule.directive('fwValidRefresh', fwValidRefresh);

		// UTILIDADES: [DIRECTIVE] Validador de tecla F5 para no perder cambios.
		fwValidRefresh.$inject = ['$log', '$document', '$window', 'KEY_CODES', 'ModalService'];
		function fwValidRefresh ($log, $document, $window, KEY_CODES, ModalService) {
			return {
				restrict : 'A',
				scope : {
					validIf: '<?'
				},
				link: link
			};

			function link (scope, element, attrs) {
				$log.debug('fwValidRefresh linked scope');

				scope.validIf = angular.isUndefined(scope.validIf) ? true : scope.validIf;

				offEvent();

				$document.on('keydown', keyReloadPageListener);

				function keyReloadPageListener(event) {
					if (event.keyCode === KEY_CODES.F5) {
						preventReloadPage(event, scope.validIf);
					}
				}

				function offEvent() {
					$document.off('keydown', keyReloadPageListener);
				}

				scope.$on('$destroy', offEvent);
			}

			function preventReloadPage(event, validIf) {
				if (validIf) {
					event.preventDefault();
					ModalService.confirm('Esta página le está pidiendo confirmar que quiere abandonarla: los datos que haya introducido podrían no guardarse.',
						function (pResult) {
							if (pResult) {
								$window.location.reload();
							}
						});
				}
			}
		}
	};

	return module;
 
})();