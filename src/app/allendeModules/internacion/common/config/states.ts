/**
 * @author 			emansilla
 * @description 	description
 */
import aboutTemplate = require('../views/internacion-about.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state({
				name : 'internacion.about',
				url : '/About',
				tempalte: aboutTemplate,
				controller: 'InternacionAboutController',
				controllerAs: 'vm'
			});
		}
	};

	return module;

})();