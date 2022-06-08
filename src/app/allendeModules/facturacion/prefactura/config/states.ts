export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state({
				name : 'prefacturacion',
				abstract: true,
				template: '<ui-view/>',
				parent : 'facturacion',
				url: '/Prefacturacion'
			});
		}
	};
	return module;
})();