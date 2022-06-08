export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {
		module.constant('ESTADO', {
			ACTIVO: 1,
			NO_ACTIVO: 0
		});

		module.constant('CALCULO_IMPORTES', {
			HONORARIOS: 1,
			DERECHOS: 2,
			TODOS: 3
		});

		module.constant('MUTUAL_SANCOR', {
			SANCOR432K: 374,
			SANCOR1K: 375,
			SANCORMADRE: 514,
			SANCOR1KSMP: 523,
			SANCOR432KSMP: 527
		});
	};
	return module;
})();