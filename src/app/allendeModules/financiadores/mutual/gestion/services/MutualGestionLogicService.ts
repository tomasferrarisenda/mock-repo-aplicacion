/**
 * @author 			Aldo Minoldo
 * @description 	description
 */
import editaItemListaFacturacion = require('../templates/itemListaFacturacionMutualEdit.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('MutualGestionLogicService', MutualGestionLogicService);

		MutualGestionLogicService.$inject = ['Logger', 'MutualGestionDataService', 'ModalService', '$q', '$uibModal'];

		function MutualGestionLogicService($log, MutualGestionDataService, ModalService, $q, $uibModal) {
			
			const service = {
				guardarMutual : guardarMutual,
				editarItemListaFacturacion : editarItemListaFacturacion
			};
			return service;

			function guardarMutual(editMutual){
				var def = $q.defer();

				var pregunta = 'Debe guardar la mutual para continuar. ¿Confirma el guardado?';
				ModalService.confirm(pregunta,
				function(pResult) {
					if (pResult) {
						MutualGestionDataService.guardarMutual(editMutual)
						.then(function(result){
							if(result.IsOk === true){
								ModalService.success('Mutual guardada.');
								def.resolve(result);
							}
							else{
								ModalService.warning('Verifique por favor. ' + result.Message);
								def.reject(result);
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							def.reject(pError);
						});
					} else{
						def.reject('cancel');
					}
				});
				return def.promise;
			}

			function editarItemListaFacturacion(item, idTipoPrefacturable) {
				return $uibModal.open({
					template: editaItemListaFacturacion,
					controller: 'ItemListaFacturacionMutualEditController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						item: function () {
							return item;
						},
						idTipoPrefacturable: function () {
							return idTipoPrefacturable;
						}
					}
				}).result;
			}
		}
	};
	return module;
})();