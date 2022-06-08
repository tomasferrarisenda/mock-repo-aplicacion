export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			
			$stateProvider.state({
				name : 'facturacion',
				abstract: true,
				template: '<ui-view/>',
				parent : 'signed',
				url: '/Facturacion'
				
			});
		}
	};
	return module;
})();