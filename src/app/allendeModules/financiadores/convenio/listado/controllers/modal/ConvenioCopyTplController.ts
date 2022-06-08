/**
 * @author:			drobledo
 * @description:	ConvenioCopyTpl
 * @type:			Controller
 **/

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ConvenioCopyTplController', ConvenioCopyTplController);

		ConvenioCopyTplController.$inject = ['Logger', '$state', 'ModalService', 'idConvenio', '$uibModalInstance', '$q', 'DateUtils', 
			'ConvenioDataService', '$scope', 'moment'];

		function ConvenioCopyTplController($log, $state, ModalService, idConvenio, $uibModalInstance, $q, DateUtils, 
			ConvenioDataService, $scope, moment) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ConvenioCopyTplController');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				convenioOrigen: {},
				fechaDesdeOrigen: '',
				fechaHastaOrigen: '',
				mutualElegida: {},
				codigoMutual: 0,
				vigenciaDesde: '',
				vigenciaHasta: '',
				copiaDto: {}
			};

			vm.filter = {
			};

			vm.formControl = {
				copiar: copiar,
				cancelar: cancelar
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function copiar() {
				if (vm.data.mutualElegida.Codigo != vm.data.convenioOrigen.CodigoFinanciador) {
					ModalService.confirm('Al copiar un convenio de un financiador a otro, se perderán las cláusulas con referencias a los planes del origen. ' +
						'¿Confirma la copia del convenio?',
						function (pResult) {
							if (pResult) {
								realizarCopia();
							}
						});
				}
				else{
					realizarCopia();
				}
			}

			function realizarCopia() {
				vm.data.copiaDto.IdFinanciadorDestino = vm.data.mutualElegida.Id;
				vm.data.copiaDto.FechaHastaDestino = DateUtils.parseToBe(vm.data.vigenciaHasta);
				vm.data.copiaDto.FechaDesdeDestino = DateUtils.parseToBe(vm.data.vigenciaDesde);
				ConvenioDataService.CopiarConvenio(vm.data.copiaDto)
					.then(function (result) {
						if(result.IsOk === true){
							ModalService.success("El convenio ha sido copiado.");
							$uibModalInstance.close("ok");
						}
						else {
							ModalService.warning("El convenio no se pudo copiar: " + result.Message);
						}
					})
					.catch(function (pError) {
						ModalService.error(pError.message);
					});
			}

			function cancelar() {
				$uibModalInstance.dismiss('close');
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				vm.title.name = 'Copiar convenio';
				vm.title.icon = 'COPY';

				ConvenioDataService.ObtenerConvenioParaEdicion(idConvenio)
					.then(function (convenio) {
						vm.data.convenioOrigen = convenio;
						vm.data.codigoMutual = convenio.CodigoFinanciador;
						vm.data.fechaDesdeOrigen = moment(vm.data.convenioOrigen.VigenciaDesde).format("DD/MM/YYYY");
						vm.data.fechaHastaOrigen = moment(vm.data.convenioOrigen.VigenciaHasta).format("DD/MM/YYYY");

						ConvenioDataService.ObtenerNuevoConvenioCopyDto(vm.data.convenioOrigen.Id)
						.then(function (copia) {
							vm.data.vigenciaDesde = copia.FechaDesdeDestino;
							vm.data.vigenciaHasta = copia.FechaHastaDestino;
							vm.data.copiaDto = copia;
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
						});
					})
					.catch(function (pError) {
						ModalService.error(pError.message);
					});
			}
		}
	};

	return module;
})();
