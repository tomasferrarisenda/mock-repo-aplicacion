/**
 * @author:			Ezequiel Mansilla
 * @description:	DropDown
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwDropDownSet', fwDropDownSet);

		fwDropDownSet.$inject = ['$log'];
		function fwDropDownSet ($log) {
			return {
				restrict : 'E',
				require : ['^fwDropDownContainer','fwDropDownSet'],
				scope : {
					data : '<?'
				},
				controller : fwDropDownSetController,
				link: link
			};

			function link (scope, element, attrs, controllers) {
				$log.debug('fwDropDownSet linked');

				var fwDropDownContainerController = controllers[0];
				var fwDropDownSetController = controllers[1];

				if (scope.data && scope.data.length) {
					for (var i = scope.data.length - 1; i >= 0; i--) {
						fwDropDownSetController.addItem(scope.data[i]);
					}
				}

				fwDropDownContainerController.setItems(fwDropDownSetController.getItems());
			}
		}

		fwDropDownSetController.$inject = ['Logger', 'DropDownItem'];
		function fwDropDownSetController ($log, DropDownItem) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwDropDownSetController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			var items : Array<any> = [];

			vm.addItem = addItem;
			vm.updateItem = updateItem;
			vm.getItems = getItems;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function addItem(pItem) {
				var item = DropDownItem.build(pItem);
				if (item.isValid()) {
					initItems();
					items.push(item);
				}
			}

			function getItems() {
				return items;
			}

			function updateItem(pItem) {
				initItems();
				for (var i = 0; i < items.length; i++) {
					if (items[i].itemReference === pItem) {
						items[i].updateStatus();
					}
				}
			}

			function initItems() {
				items = items || [];
			}

		}
	};

	return module;
})();