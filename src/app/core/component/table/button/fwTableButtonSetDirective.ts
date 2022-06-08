/**
 * @author:			Ezequiel Mansilla
 * @description:	Set de botones de table
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableButtonset', fwTableButtonset);

		fwTableButtonset.$inject = ['$log'];
		function fwTableButtonset ($log) {
			return {
				restrict : 'E',
				require : ['^fwTableContainer', 'fwTableButtonset'],
				scope : {
					data : '<?'
				},
				link: link,
				controller : fwTableButtonsetController
			};

			function link (scope, element, attrs, controllers) {
				// $log.debug('fwTableButtonset linked');
				var fwTableContainer = controllers[0];
				var fwTableButtonset = controllers[1];

				// Si vienen definidas las botones las agrego de a una por validaciones que se puedan
				// llegar a hacer
				if (scope.data && scope.data.length) {
					for (var i = scope.data.length - 1; i >= 0; i--) {
						fwTableButtonset.addButton(scope.data[i]);
					}
				}

				var buttons = fwTableButtonset.getButtonsVisible();

				if (buttons.length)
					fwTableContainer.setButtonset(fwTableButtonset.getButtonset());
			}
		}

		fwTableButtonsetController.$inject = ['Logger', 'ButtonSet'];
		function fwTableButtonsetController($log, ButtonSet) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwTableButtonsetController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			var buttonset : any = {};

			vm.addButton = addButton;
			vm.getButtonsVisible = getButtonsVisible;
			vm.getButtonset = getButtonset;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			 * Agrega boton al set de botones
			 * @param {Button} pButton
			 */
			function addButton(pButton) {
				buttonset = ButtonSet.build(buttonset);
				buttonset.addButton(pButton);
			}

			function getButtonsVisible() {
				var buttons = buttonset.buttons || [];
				var buttonsReturn : Array<any> = [];

				for (var i = buttons.length - 1; i >= 0; i--) {
					if (buttons[i].visible) buttonsReturn.push(buttons[i]);
				}

				return buttonsReturn;
			}

			function getButtonset() {
				return buttonset;
			}
		}
	};

	return module;
})();