/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para inputs
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saFormInput', fwFormInput);
		ngModule.directive('fwFormInput', fwFormInput);

		fwFormInput.$inject = [];
		function fwFormInput () {
			return {
				restrict : 'A',
				link: link
			};

			function link (scope, element, attrs) {
				setupDom(element[0]);
			}

			function setupDom(element) {
				const label = element.querySelector('label');
				// Si hay label, le agrego
				if (label) label.classList.add('control-label');

				const input = element.querySelector('input, textarea, select');
				// Si hay input
				if (input) {
					const type = input.getAttribute('type');
					if (type !== 'checkbox' && type !== 'radio') {
						input.classList.add('form-control');
					}
				} else { // Si NO hay input
					const p = element.querySelector('p');
					if (p) p.classList.add('form-control-static');
				}
				
				element.classList.add('form-group');
			}
		}
	};

	return module;

})();