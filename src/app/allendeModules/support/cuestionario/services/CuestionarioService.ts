/**
 * @author 			mastore
 * @description 	description
 */
export interface ICuestionarioService {
	NewCuestionario(idTipoCuestionario: number, idTipoEntidad: number, idEntidad: number, extraInfo: any): any;
}

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CuestionarioService', CuestionarioService);

		CuestionarioService.$inject = ['$uibModal', 'Logger'];
		
		function CuestionarioService ($uibModal, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CuestionarioService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				NewCuestionario: NewCuestionario
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function NewCuestionario(pTipoCuestionario, pIdTipoEntidad, pIdEntidad, pExtraInfo) {
				var obtenerCuestionario = {
					tipoCuestionario: pTipoCuestionario,
					idTipoEntidad: pIdTipoEntidad,
					idEntidad: pIdEntidad
				};
				return $uibModal.open({
					component: 'saCuestionario',
					size : 'md',
					resolve : {
						obtenerCuestionario : function () {
							return obtenerCuestionario;
						},
						InfoExtra: function () {
							return pExtraInfo;
						}
					}
				}).result;
			}
		}
	};

	return module;

})();