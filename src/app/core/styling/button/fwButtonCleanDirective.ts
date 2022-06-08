/**
 * @author:			Ezequiel Mansilla
 * @description:	Clases para botones
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwBtnClean', fwButtonClean);
		ngModule.directive('saBtnClean', fwButtonClean);

		fwButtonClean.$inject = ['$log', '$compile'];
		function fwButtonClean ($log, $compile) {
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
				element.classList.add('btn-default');
			}

			function addIcon(scope, element, icon) {
				const iconName = (icon) ? icon : 'CLEAN';
				const template = '<span><fw-icon name="' + iconName + '"></fw-icon>&nbsp;</span>';
				element.prepend($compile(template)(scope));
			}
		}
	};

	return module;
})();