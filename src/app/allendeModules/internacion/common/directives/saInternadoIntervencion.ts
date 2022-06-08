/**
 * @author 			emansilla
 * @description 	description
 */
import intervencionTemplate = require('../templates/sa-internado-intervencion.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saInternadoIntervencion', saInternadoIntervencion);

		saInternadoIntervencion.$inject = [];
		function saInternadoIntervencion () {
			return {
				restrict : 'E',
				template: intervencionTemplate
			};
		}
	};

	return module;

})();