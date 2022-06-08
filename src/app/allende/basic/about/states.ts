/**
 * @author 			emansilla
 * @description 	description
 */
'use strict';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state(
			{
				name : 'signed.about',
				url : '/About',
				template: '<sa-about></sa-about>'
			});
		}
	};

	return module;
})();