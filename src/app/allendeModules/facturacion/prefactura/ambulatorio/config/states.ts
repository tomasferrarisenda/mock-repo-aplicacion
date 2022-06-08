import PrefacturaAmbulatorioNew = require('../views/PrefacturaAmbulatorioNew.html');
import PrefacturaAmbulatorioList = require('../views/PrefacturaAmbulatorioList.html');

export default (function() {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider', '$urlRouterProvider'];

		function routes ($stateProvider, $urlRouterProvider)
		{
			$stateProvider.state(
			{
				name : 'prefacturacion.ambulatorio',
				url : '/Ambulatorio',
				template : '<ui-view/>',
				data : {
					module: 'AMBULATORIO'
				}
			});

			$stateProvider.state(
			{
				name : 'prefacturacion.ambulatorio.list',
				url : '/List',
				template: PrefacturaAmbulatorioList,
				controller: 'PrefacturaAmbulatorioListController',
				controllerAs: 'vm',
				data : {
					idPermiso: 93,
				}
			});

			$stateProvider.state(
			{
				name : 'prefacturacion.ambulatorio.new',
				url : '/New',
				template: PrefacturaAmbulatorioNew,
				controller: 'PrefacturaAmbulatorioNewController',
				controllerAs: 'vm',
				params : {
					id : null,
					idAmbito : null
				},
				data : {
					idPermiso: 90,
				}
			});
		}
	};

	return module;
})();