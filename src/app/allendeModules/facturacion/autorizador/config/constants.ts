export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_AUTORIZADOR', {
			MODULE: 'AUTORIZADORES',
			LIST : 'Lista de Autorizaciones',
			VIEW : 'Detalle de Autorización'
		});

		module.constant('ACTION_AUTORIZADOR', {
			INIT : '/Autorizador',
			DEFAULT : '/Autorizador/List/Autorizaciones',
			LIST : '/Autorizador/List/Autorizaciones'
		});

	};
	return module;
})();