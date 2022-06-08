import cuentasDefecto = require('../templates/cuentasDefecto.tpl.html');
import participacion = require('../templates/participacion.tpl.html');
import facturaDirecto = require('../templates/facturaDirectoEdit.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ContratosInternosLogicService', ContratosInternosLogicService);

		ContratosInternosLogicService.$inject = ['$log', '$uibModal', 'ModalService', 'ContratosInternosDataService', '$q', 'DateUtils'];

		function ContratosInternosLogicService ($log, $uibModal, ModalService, ContratosInternosDataService, $q, DateUtils) {
			
			const service = {
				editarCuenta : editarCuenta,
				editarParticipacion : editarParticipacion,
				guardarContrato : guardarContrato,
				editarFacturaDirecta : editarFacturaDirecta
			};
			return service;

			function editarCuenta(idCuenta, numeroCuenta, idContratoEdit, pContratableElegido) {
				return $uibModal.open({
					template: cuentasDefecto,
					controller: 'CuentasDefectoContratoTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idCuentaEdit: function () {
							return idCuenta;
						},
						numeroCuenta: function () {
							return numeroCuenta;
						},
						idContratoEdit: function () {
							return idContratoEdit;
						},
						ContratableElegido: function () {
							return pContratableElegido;
						}
					}
				}).result;
			}

			function editarParticipacion(idParticipacionEdit, idContratoEdit) {
				return $uibModal.open({
					template: participacion,
					controller: 'ParticipacionTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idParticipacionEdit: function () {
							return idParticipacionEdit;
						},
						idContratoEdit: function () {
							return idContratoEdit;
						}
					}
				}).result;
			}

			function editarFacturaDirecta(idFacturaDirectoEdit, idContratoEdit  ) {
				return $uibModal.open({
					template: facturaDirecto,
					controller: 'facturaDirectoEditController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idFacturaDirectoEdit: function () {
							return idFacturaDirectoEdit;
						},
						idContratoEdit: function () {
							return idContratoEdit;
						}

					}
				}).result;
			}
			
			// Centralizo el guardar contratos, ya que se puede activar cuando se realiza uno nuevo, y se va a la solapa de Documentos,
			// o agregar una nueva cuenta por defecto
			function guardarContrato(editContrato, Contratable, fechaInicio, fechaFin){
				var def = $q.defer();
				editContrato.IdEntidad = Contratable ? Contratable.Id : null ;
				editContrato.IdTipoEntidadContratoInterno = Contratable ? Contratable.IdTipoEntidadContratoInterno : null ;
				editContrato.Desde = DateUtils.parseToBe(fechaInicio);
				editContrato.Hasta = DateUtils.parseToBe(fechaFin);

				var pregunta = editContrato.Id === 0 ? 'Debe guardar el contrato para continuar, ¿desea hacerlo?' : '¿Confirma guardar el contrato?';
				ModalService.confirm(pregunta,
				function(pResult) {
					if (pResult) {
						ContratosInternosDataService.Guardar(editContrato)
						.then(function(result){
							if(result.IsOk === true){
								//editContrato = result.Entidad;
								ModalService.success('Contrato guardado.');
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
		}
	};

	return module;

})();