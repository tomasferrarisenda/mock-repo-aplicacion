/**
 * @author:			Ezequiel Mansilla
 * @description:	AbmcModel 
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwAbmcModel', fwAbmcModel);

		fwAbmcModel.$inject = ['$log'];
		function fwAbmcModel ($log) {
			return {
				restrict : 'E',
				require : ['^fwAbmcContainer', 'fwAbmcModel'],
				scope : {
					name : '<?'
				},
				controller: fwAbmcModelController,
				link: link
			};

			function link (scope, element, attrs, controllers) {
				$log.debug('fwAbmcModel linked');
				var fwAbmcContainerController = controllers[0];
				var fwAbmcModelController = controllers[1];
				fwAbmcModelController.setName(scope.name);
				fwAbmcContainerController.setModel(fwAbmcModelController.getModel());
			}
		}

		fwAbmcModelController.$inject = ['Logger', 'AbmcModel', 'AbmcModelAttribute'];
		function fwAbmcModelController($log, AbmcModel, AbmcModelAttribute) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwAbmcModelController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			var model : any = {
				name: '',
				attributes: []
			};

			vm.addAttribute = addAttribute;
			vm.setName = setName;
			vm.updateAttribute = updateAttribute;
			vm.getModel = getModel;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function addAttribute(pAttribute) {
				var attr = AbmcModelAttribute.build(pAttribute);
				if (attr.isValid()) model.addAttribute(attr);
			}

			function setName(pName) {
				model.name = pName;
			}

			function updateAttribute(pAttribute) {
				// body...
			}

			function getModel() {
				return model;
			}

			function createModel() {
				model = AbmcModel.build(model);
			}

			/* --------------------------------------------- ACTIVATE --------------------------------------------- */

			activate();
			function activate() {
				createModel();
			}
		}
	};

	return module;
})();