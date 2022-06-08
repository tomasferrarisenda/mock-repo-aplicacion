/**
 * @author:			Ezequiel Mansilla
 * @description:	Renderización del abmc
 * @type:			Directive
 **/
import fwAbmcRenderTemplate = require("./fwAbmcRenderTemplate.html");

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwAbmcRender', fwAbmcRender);

		fwAbmcRender.$inject = ['$log'];
		function fwAbmcRender ($log) {
			return {
				restrict : 'E',
				require: '^fwAbmcContainer',
				template : fwAbmcRenderTemplate,
				link: link
			};

			function link (scope, element, attrs, fwAbmcContainerController) {
				$log.debug('fwAbmcRender linked');

				function initData(pAbmc) {
					scope.abmc = pAbmc;
					$log.debug('fwAbmcRender initData', scope.abmc);
					scope.cols = scope.abmc.model.attributes;
					var baseAction = scope.abmc.actionService.getBaseAction();
					scope.title = baseAction.title;
					scope.icon = baseAction.icon;
					scope.abmc.actionService.callFunction(baseAction.method)
					.then(function (pResult) {
						scope.rows = baseAction.map(pResult);
						$log.debug('fwAbmcRender::initData::entro al then', pResult);
					});
				}

				scope.$on('fw-abmc-ready-to-render-event', function (event, table) {
					// $log.debug('fwAbmcRender ready to render event',data);
					if (scope.abmc.equals(table)) {
						initData(table);
					}
				});

				activate();
				function activate() {
					var data = fwAbmcContainerController.getAbmc();
					initData(data);
				}
			}
		}
	};

	return module;

})();