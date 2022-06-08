export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_HOMOLOGACIONES', {
			MODULE: 'HOMOLOGACIONES',
			LIST : 'Lista de Homologaciones',
			VIEW : 'Detalle de Homologación'
		});

		module.constant('ACTION_HOMOLOGACIONES', {
			INIT : '/Homologaciones',
			DEFAULT : '/Financiadores/Homologaciones',
			LIST : '/Financiadores/Homologaciones'
		});

	};
	return module;
})();