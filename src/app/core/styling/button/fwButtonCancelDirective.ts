/**
 * @author:			Ezequiel Mansilla
 * @description:	Clases para botones
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwBtnCancel', fwButtonCancel);
		ngModule.directive('saBtnCancel', fwButtonCancel);

		fwButtonCancel.$inject = ['$log', '$compile'];
		function fwButtonCancel ($log, $compile) {
			return {
				restrict : 'A',
				link: link
			};

			function link (scope, element, attrs) {
				setupDom(element[0]);
				addIcon(scope, element, attrs.icon);
			}

			function setupDom(element) {
				if (!element) return;
				element.classList.add('btn');
			}

			function addIcon(scope, element, icon) {
				const iconName = (icon) ? icon : 'CANCEL';
				const template = '<span><fw-icon name="' + iconName + '"></fw-icon>&nbsp;</span>';
				element.prepend($compile(template)(scope));
			}
		}
	};

	return module;
})();