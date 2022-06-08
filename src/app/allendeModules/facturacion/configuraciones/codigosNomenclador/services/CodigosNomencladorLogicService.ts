
import editaCodigoNomenclador = require('../templates/codigoNomenclador-edit.tpl.html');

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('CodigosNomencladorLogicService', CodigosNomencladorLogicService);

		CodigosNomencladorLogicService.$inject = ['$log', '$uibModal'];

		function CodigosNomencladorLogicService($log, $uibModal) {

			// API o Interface
			const service = {
				editarCodigoNomenclador: editarCodigoNomenclador
			};

			return service;

			function editarCodigoNomenclador(codigoNomenclador) {

				var _codNomenclador = codigoNomenclador;
				return $uibModal.open({
					template: editaCodigoNomenclador,
					controller: 'CodigoNomencladorEditController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						CodigoNomencladorSeleccionado: function () {
							return _codNomenclador;
						}
					}
				}).result;
			}

		}
	};

	return module;
})();