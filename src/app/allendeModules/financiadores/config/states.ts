export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state({
				name : 'financiadores',
				parent : 'signed',
				url : '/Financiadores',
				template : '<ui-view><sa-loading></sa-loading></ui-view>',
				data : {
					module : 'FINANCIADORES',
					path : ''
				}
			});
		}
	};

	return module;
})();