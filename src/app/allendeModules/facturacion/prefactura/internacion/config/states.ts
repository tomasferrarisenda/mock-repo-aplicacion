import PrefacturaInternacionNew = require('../views/PrefacturaInternacionNew.html');
import PrefacturaInternacionList = require('../views/PrefacturaInternacionList.html');
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider', '$urlRouterProvider'];

		function routes ($stateProvider, $urlRouterProvider)
		{
			$stateProvider.state(
			{
				name : 'prefacturacion.internacion',
				url : '/Internacion',
				template : '<ui-view/>'
			});

			$stateProvider.state(
			{
				name : 'prefacturacion.internacion.new',
				url : '/New',
				template: PrefacturaInternacionNew,
				controller: 'PrefacturaInternacionNewController',
				controllerAs: 'vm',
				data : {
					idPermiso: 94
				}
			});

			$stateProvider.state(
			{
				name : 'prefacturacion.internacion.list',
				url : '/List',
				template: PrefacturaInternacionList,
				controller: 'PrefacturaInternacionListController',
				controllerAs: 'vm',
				data : {
					idPermiso: 97
				}
			});

			$stateProvider.state(
			{
				name: 'prefacturacion.internacion.medicamentos',
				url: '/Medicamento',
				template: '<sa-farmacia-facturacion-contenedor edit-precio="true"><sa-loading></sa-loading></sa-farmacia-facturacion-contenedor>',
				data: {
					idPermiso: 278,
					module: 'Medicamentos'
				}
			});
		}
	};

	return module;
})();