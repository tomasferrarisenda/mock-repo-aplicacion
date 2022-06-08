export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_CONFIGURACIONES_CN', {
			MODULE: 'CONFIGURACIONES',
			LIST : 'Lista de Codigos de Nomenclador',
			VIEW : 'Editar Codigo de Nomenclador'
		});

		module.constant('ACTION_CONFIGURACIONES_CN', {
			INIT : '/Configuraciones',
			DEFAULT : '/Configuraciones/List/CodigosNomenclador',
			LIST : '/Configuraciones/List/CodigosNomenclador'
		});

	};
	return module;
})();