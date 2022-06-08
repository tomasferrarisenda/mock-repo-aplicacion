import editaCondicion = require('../templates/condicionEdit.tpl.html');
import editaConsecuencia = require('../templates/consecuenciaEdit.tpl.html');
import editaItemListaPrecio = require('../templates/itemListaPrecioEdit.tpl.html');
import editaUnidadArancelaria = require('../templates/unidadArancelariaEdit.tpl.html');
import editaDimension = require('../templates/dimensionables/dimensionableEdit.tpl.html');
import editaListaFacturacionDimensionable = require('../templates/dimensionables/listaDimensionableEdit.tpl.html');
import seleccionaListaPrecio = require('../templates/consecuencias/listaPrecioConvenio.tpl.html');
import seleccionaRequisitoAdministrativo = require('../templates/consecuencias/requisitoAdministrativo.tpl.html');
import copiaConvenio = require('../templates/convenioCopy.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ConvenioLogicService', ConvenioLogicService);

		ConvenioLogicService.$inject = ['$log', '$uibModal', 'ModalService', 'ConvenioDataService', '$q', 'DateUtils'];

		function ConvenioLogicService ($log, $uibModal, ModalService, ConvenioDataService, $q, DateUtils) {
			
			const service = {
				editarCondicion : editarCondicion,
				editarConsecuencia : editarConsecuencia,
				editarItemListaPrecio : editarItemListaPrecio,
				editarUnidadArancelaria : editarUnidadArancelaria,
				guardarConvenio : guardarConvenio,
				descargarDocumento : descargarDocumento, 
				editarDimensionable : editarDimensionable,
				editarListaFacturacionDimensionable : editarListaFacturacionDimensionable,
				seleccionListaPrecio : seleccionListaPrecio,
				seleccionRequisitoAdministrativo : seleccionRequisitoAdministrativo,
				copiarConvenio : copiarConvenio
			};
			return service;


			function editarCondicion(condicionEditDto, idFinanciador, idConvenio) {
				return $uibModal.open({
					template: editaCondicion,
					controller: 'CondicionEditTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						condicionEditDto: function () {
							return condicionEditDto;
						},
						idFinanciador: function () {
							return idFinanciador;
						},
						idConvenio: function () {
							return idConvenio;
						}
					}
				}).result;
			}

			function editarConsecuencia(consecuenciaEditDto, idConvenio) {
				return $uibModal.open({
					template: editaConsecuencia,
					controller: 'ConsecuenciaEditTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'md',
					resolve: {
						consecuenciaEditDto: function () {
							return consecuenciaEditDto;
						},
						idConvenio: function () {
							return idConvenio;
						},
					}
				}).result;
			}

			function editarItemListaPrecio(item, idTipoPrefacturable) {
				return $uibModal.open({
					template: editaItemListaPrecio,
					controller: 'ItemListaPrecioEditTplController',
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

			function editarUnidadArancelaria(idUnidadEdit) {
				return $uibModal.open({
					template: editaUnidadArancelaria,
					controller: 'UnidadArancelariaEditTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'md',
					resolve: {
						idUnidadEdit: function () {
							return idUnidadEdit;
						}
					}
				}).result;
			}

			function editarDimensionable(condicion, idFinanciador, tipoValorConsecuencia) {
				return $uibModal.open({
					template: editaDimension,
					controller: 'DimensionableEditTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						condicion: function () {
							return condicion;
						},
						idFinanciador: function () {
							return idFinanciador;
						},
						tipoValorConsecuencia: function (){
							return tipoValorConsecuencia
						}
					}
				}).result;
			}

			function editarListaFacturacionDimensionable(condicion, idFinanciador, idConvenio, idDimension) {
				return $uibModal.open({
					template: editaListaFacturacionDimensionable,
					controller: 'ListaDimensionableEditTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						condicion: function () {
							return condicion;
						},
						idFinanciador: function () {
							return idFinanciador;
						},
						idConvenio: function (){
							return idConvenio
						},
						idDimension: function (){
							return idDimension
						}
					}
				}).result;
			}

			function seleccionListaPrecio(consecuencia, idConvenio) {
				return $uibModal.open({
					template: seleccionaListaPrecio,
					controller: 'listaPrecioConvenioController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idConvenio: function () {
							return idConvenio;
						},
						consecuencia: function () {
							return consecuencia;
						}
					}
				}).result;
			}

			function seleccionRequisitoAdministrativo(consecuencia) {
				return $uibModal.open({
					template: seleccionaRequisitoAdministrativo,
					controller: 'listaRequisitoAdministrativoController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						consecuencia: function () {
							return consecuencia;
						}
					}
				}).result;
			}

			function copiarConvenio(idConvenio) {
				return $uibModal.open({
					template: copiaConvenio,
					controller: 'ConvenioCopyTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idConvenio: function () {
							return idConvenio;
						}
					}
				}).result;
			}

			// Centralizo el guardar convenios, ya que se puede activar cuando se realiza uno nuevo,
			// y se va a la solapa de Documentos, o bien se quiere agregar una nueva clausula o lista de precios
			function guardarConvenio(editConvenio, Mutual, vigenciaDesde, vigenciaHasta, idEstado){
				var def = $q.defer();
				editConvenio.IdFinanciador = Mutual ? Mutual.Id : 0 ;
				editConvenio.VigenciaDesde = DateUtils.parseToBe(vigenciaDesde);
				editConvenio.VigenciaHasta = DateUtils.parseToBe(vigenciaHasta);
				editConvenio.IdEstadoConvenio = idEstado;

				var pregunta = editConvenio.Id === 0 ? 'Debe guardar el convenio para continuar, ¿desea hacerlo?' : '¿Confirma guardar el convenio?';
				ModalService.confirm(pregunta,
				function(pResult) {
					if (pResult) {
						ConvenioDataService.Guardar(editConvenio)
						.then(function(result){
							if(result.IsOk === true){
								ModalService.success('Convenio guardado.');
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

			function descargarDocumento(idDocumento, fileName){
				ConvenioDataService.DescargarDocumentoAsociadoPorId(idDocumento, fileName);
			}
		}
	};

	return module;

})();