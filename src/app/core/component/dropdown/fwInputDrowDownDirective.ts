/**
 * @author:			Pablo pautasso
 * @description:	Render DropDown
 * @type:			Directive
 **/
import fwDropDownInputTemplate = require("./fwDropDownInputTemplate.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwDropDownInput', fwDropDownInput);

		fwDropDownInput.$inject = ['$log'];
		function fwDropDownInput ($log) {
			return {
				restrict : 'E',
				require : '^fwDropDownContainer',
				template : fwDropDownInputTemplate,
				link: link,
				scope: {
					configOpen: '=?'
				}
			};

			function link (scope, element, attrs, fwDropDownContainerController) {
				$log.debug('fwDropDownInput linked');

				scope.changeStatus = changeStatus;
				scope.onToggle = onToggle;
				scope.toggleDropdown = toggleDropdown;
				

				function changeStatus(pItem) {
					pItem.changeStatus();
					fwDropDownContainerController.notifyChange();
				}

				activate();

				function activate() {
					scope.dropdown = fwDropDownContainerController.getDropDown();
				}

				function onToggle(status) {
					$log.debug('onToggle',status);
					
					if(!status){ 
						scope.configOpen = false;
						// $('#btn-open-options-drop')[0].value = '';
						
					} 
				}

				function toggleDropdown($event) {
					$event.preventDefault();
					$event.stopPropagation();
					scope.status.isopen = true;
				}

				scope.$watch(function () {
					return scope.configOpen;
				}, function (newValue, oldValue) {
					if(newValue){
						if(newValue){
							
							setTimeout(() => { 
								$('#btn-open-options-drop')[0].focus(); 
								scope.status.isopen = true;
							}, 500);
						}
					}
				});


			}
		}
	};

	return module;
})();