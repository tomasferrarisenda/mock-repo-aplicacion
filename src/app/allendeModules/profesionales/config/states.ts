export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider'];

		function states ($stateProvider)
		{
			$stateProvider.state({
				name : 'profesionales',
				parent : 'signed',
				url : '/Profesionales',
				template : '<ui-view><sa-loading></sa-loading></ui-view>',
				data : {
					module : 'PROFESIONALES',
					path : ''
				}
			});
		}
	};

	return module;
})();