import { IDtoService } from "core/http";

/**
 * @author:			Pedro Ferrer
 * @description:	Convenios
 * @type:			Service
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('ConvenioDataService', ConvenioDataService);

		ConvenioDataService.$inject = ['DotService'];

		function ConvenioDataService(DotService: IDtoService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var mutualFiltroBusqueda = null;
			var codigoMutualFiltroBusqueda = null;
			var fechaVigenciaFiltroBusqueda = null;
			var ultimaActualizacionAntesDe = null;
			var estadoFiltroBusqueda = null;
			var tipoMutualElegida = null;
			var currentPageFiltroBusqueda = null;

			const service = {
				ObtenerTodosEstadosConvenios: ObtenerTodosEstadosConvenios,
				ObtenerFiltroConvenioDto: ObtenerFiltroConvenioDto,
				ObtenerConveniosFiltrados: ObtenerConveniosFiltrados,
				ObtenerConvenioParaEdicion: ObtenerConvenioParaEdicion,
				ObtenerNuevoConvenioDto: ObtenerNuevoConvenioDto,
				Guardar: Guardar,
				ObtenerClausulaDto: ObtenerClausulaDto,
				ObtenerNuevaClausulaDelConvenioDtoParaEdicion: ObtenerNuevaClausulaDelConvenioDtoParaEdicion,
				ObtenerListaPrecioDto: ObtenerListaPrecioDto,
				ObtenerTodosUnidadArancelaria: ObtenerTodosUnidadArancelaria,
				ObtenerNuevaListaPrecioDelConvenioDtoParaEdicion: ObtenerNuevaListaPrecioDelConvenioDtoParaEdicion,
				ObtenerPorId: ObtenerPorId,
				EliminarClausulaDeConvenio: EliminarClausulaDeConvenio,
				EliminarUnidadArancelariaConvenioPorId: EliminarUnidadArancelariaConvenioPorId,
				EliminarListaPreciosConvenioPorId: EliminarListaPreciosConvenioPorId,
				ObtenerTiposUnidadesArancelarias: ObtenerTiposUnidadesArancelarias,
				ObtenerTipoUnidadArancelariaPorId: ObtenerTipoUnidadArancelariaPorId,
				ObtenerUnidadArancelariaConvenioParaEdicion: ObtenerUnidadArancelariaConvenioParaEdicion,
				ObtenerNuevaUnidadArancelariaConvenioParaEdicion: ObtenerNuevaUnidadArancelariaConvenioParaEdicion,
				GuardarUnidadArancelariaConvenio: GuardarUnidadArancelariaConvenio,
				ObtenerItemListaPreciosConvenioDtoParaEdicion: ObtenerItemListaPreciosConvenioDtoParaEdicion,
				ObtenerNuevoItemListaPreciosConvenioDtoParaEdicion: ObtenerNuevoItemListaPreciosConvenioDtoParaEdicion,
				GuardarItemListaPreciosConvenio: GuardarItemListaPreciosConvenio,
				EliminarItemListaPreciosConvenioPorId: EliminarItemListaPreciosConvenioPorId,
				TipoListaPrefacturablesObtenerTodos : TipoListaPrefacturablesObtenerTodos,
				GuardarListaPreciosConvenio: GuardarListaPreciosConvenio,
				ObtenerNuevaListadePreciosImportDto: ObtenerNuevaListadePreciosImportDto,
				ObtenerNuevaCondicionParaEdicion: ObtenerNuevaCondicionParaEdicion,
				ObtenerCondicionParaEdicion: ObtenerCondicionParaEdicion,
				ObtenerNuevaConsecuenciaParaEdicion: ObtenerNuevaConsecuenciaParaEdicion,
				ObtenerConsecuenciaParaEdicion: ObtenerConsecuenciaParaEdicion,
				ObtenerOperadoresDeCondicion: ObtenerOperadoresDeCondicion,
				ObtenerOperadorDeCondicion: ObtenerOperadorDeCondicion,
				ObtenerDimensiones: ObtenerDimensiones,
				ObtenerDimension: ObtenerDimension,
				ObtenerTiposConsecuencia: ObtenerTiposConsecuencia,
				ObtenerSubTiposConsecuencia: ObtenerSubTiposConsecuencia,
				ObtenerSubTipoConsecuencia: ObtenerSubTipoConsecuencia,
				ImportarExcel: ImportarExcel,
				ExportarExcel: ExportarExcel,
				ExportarPdf : ExportarPdf,
				getNuevoDocumentoAsociadoDto: getNuevoDocumentoAsociadoDto,
				ObtenerDimensionablesPorTipo: ObtenerDimensionablesPorTipo,
				ObtenerDimensionablePorTipoEId: ObtenerDimensionablePorTipoEId,
				ObtenerNuevoValorCondicionEditDto: ObtenerNuevoValorCondicionEditDto,
				ObtenerCondicionConValoresFormateados: ObtenerCondicionConValoresFormateados,
				ObtenerConsecuenciaConValoresFormateados: ObtenerConsecuenciaConValoresFormateados,
				ObtenerNuevoValorConsecuenciaEditDto: ObtenerNuevoValorConsecuenciaEditDto,
				ObtenerValoresPosiblesPorSubTipoConsecuencia: ObtenerValoresPosiblesPorSubTipoConsecuencia,
				GuardarClausulaEnConvenio: GuardarClausulaEnConvenio,
				ObtenerListasPrefacturablesPorTipo : ObtenerListasPrefacturablesPorTipo,
				ObtenerListasDePreciosConvenioParaSeleccion: ObtenerListasDePreciosConvenioParaSeleccion,
				ObtenerRequisitosAdministrativosParaSeleccion: ObtenerRequisitosAdministrativosParaSeleccion,
				ObtenerNuevoConvenioCopyDto: ObtenerNuevoConvenioCopyDto,
				CopiarConvenio: CopiarConvenio,
				EliminarConvenio: EliminarConvenio,
				ObtenerTodosTiposMutual : ObtenerTodosTiposMutual,
				ExportConveniosFiltrados : ExportConveniosFiltrados
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function ObtenerTodosEstadosConvenios() {
				var _url = 'EstadosConvenio/ObtenerTodosEstados';
				return DotService.Get(_url, { isCachable: true });
			}

			function ObtenerFiltroConvenioDto() {
				var _url = 'Convenio/ObtenerFiltroConvenioDto';
				return DotService.Get(_url);
			}

			function ObtenerConveniosFiltrados(filtroDto) {
				var _url = 'Convenio/ObtenerConveniosFiltrados';
				return DotService.Post(_url, filtroDto);
			}

			function ObtenerConvenioParaEdicion(idConvenio) {
				var _url = 'Convenio/ObtenerPorId/' + idConvenio;
				return DotService.Get(_url);
			}

			function ObtenerNuevoConvenioDto() {
				var _url = 'Convenio/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function Guardar(convenioDto) {
				var _url = 'Convenio/Guardar';
				return DotService.Post(_url, convenioDto);
			}

			function ObtenerClausulaDto(idClausulaEdit) {
				var _url = 'Convenio/Clausula/ObtenerClausulaParaEdicion/' + idClausulaEdit;
				return DotService.Get(_url);
			}

			function ObtenerNuevaClausulaDelConvenioDtoParaEdicion(idConvenio) {
				var _url = 'Convenio/Clausula/ObtenerNuevaClausulaDelConvenioDtoParaEdicion/' + idConvenio;
				return DotService.Get(_url);
			}

			function ObtenerListaPrecioDto(idListaEdit) {
				var _url = 'Convenio/ListaPrecios/ObtenerListaPreciosConvenioParaEdicion/' + idListaEdit;
				return DotService.Get(_url);
			}

			function ObtenerNuevaListaPrecioDelConvenioDtoParaEdicion(idConvenio) {
				var _url = 'Convenio/ListaPrecios/ObtenerNuevaListaPrecioDelConvenioDtoParaEdicion/' + idConvenio;
				return DotService.Get(_url);
			}

			function ObtenerPorId(idTipo) {
				var _url = 'TipoPrefacturable/ObtenerPorId/' + idTipo;
				return DotService.Get(_url, { isCachable: true });
			}

			function EliminarClausulaDeConvenio(ClausulaDto) {
				var _url = 'Convenio/Clausula/EliminarClausula';
				return DotService.Post(_url, ClausulaDto);
			}

			function EliminarUnidadArancelariaConvenioPorId(idUnidad) {
				var _url = 'Convenio/UnidadArancelaria/Eliminar/' + idUnidad;
				return DotService.Post(_url,{});
			}

			function EliminarListaPreciosConvenioPorId(idLista) {
				var _url = 'Convenio/ListaPrecios/EliminarListaPreciosConvenioPorId/' + idLista;
				return DotService.Post(_url, idLista);
			}

			function ObtenerTodosUnidadArancelaria() {
				var _url = 'UnidadArancelaria/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function ObtenerTiposUnidadesArancelarias() {
				var _url = 'UnidadArancelaria/ObtenerTiposUnidadesArancelarias';
				return DotService.Get(_url);
			}

			function ObtenerTipoUnidadArancelariaPorId(idTipo) {
				var _url = 'UnidadArancelaria/ObtenerTipoUnidadArancelariaPorId/' + idTipo;
				return DotService.Get(_url);
			}

			function ObtenerUnidadArancelariaConvenioParaEdicion(idTipo) {
				var _url = 'Convenio/UnidadArancelaria/ObtenerUnidadArancelariaConvenioParaEdicion/' + idTipo;
				return DotService.Get(_url);
			}

			function ObtenerNuevaUnidadArancelariaConvenioParaEdicion(idConvenio) {
				var _url = 'Convenio/UnidadArancelaria/ObtenerNuevaUnidadArancelariaConvenioParaEdicion/' + idConvenio;
				return DotService.Get(_url);
			}

			function GuardarUnidadArancelariaConvenio(unidadArancelaria) {
				var _url = 'Convenio/UnidadArancelaria/Guardar';
				return DotService.Post(_url, unidadArancelaria);
			}

			function ObtenerNuevoItemListaPreciosConvenioDtoParaEdicion() {
				var _url = 'Convenio/ListaPrecios/ObtenerNuevoItemListaPreciosConvenioDtoParaEdicion';
				return DotService.Get(_url);
			}

			function ObtenerItemListaPreciosConvenioDtoParaEdicion(idItemLista) {
				var _url = 'Convenio/ListaPrecios/ObtenerItemListaPreciosConvenioDtoParaEdicion/' + idItemLista;
				return DotService.Post(_url, idItemLista);
			}

			function GuardarItemListaPreciosConvenio(itemListaDto) {
				var _url = 'Convenio/ListaPrecios/GuardarItemListaPreciosConvenio';
				return DotService.Post(_url, itemListaDto);
			}

			function EliminarItemListaPreciosConvenioPorId(idItem) {
				var _url = 'Convenio/ListaPrecios/EliminarItemListaPreciosConvenioPorId/' + idItem;
				return DotService.Post(_url, idItem);
			}

			function GuardarListaPreciosConvenio(listaItem) {
				var _url = 'Convenio/ListaPrecios/GuardarListaPreciosConvenio';
				return DotService.Post(_url, listaItem);
			}

			function ObtenerNuevaListadePreciosImportDto() {
				var _url = 'Convenio/ListaPrecios/ObtenerNuevaListadePreciosImportDto';
				return DotService.Get(_url);
			}

			function ObtenerNuevaCondicionParaEdicion() {
				var _url = 'Convenio/Clausula/ObtenerNuevaCondicionParaEdicion';
				return DotService.Get(_url);
			}

			function ObtenerCondicionParaEdicion(idCondicion) {
				var _url = 'Convenio/Clausula/ObtenerCondicionParaEdicion/' + idCondicion;
				return DotService.Get(_url);
			}

			function ObtenerNuevaConsecuenciaParaEdicion() {
				var _url = 'Convenio/Clausula/ObtenerNuevaConsecuenciaParaEdicion';
				return DotService.Get(_url);
			}

			function ObtenerConsecuenciaParaEdicion(idConsecuencia) {
				var _url = 'Convenio/Clausula/ObtenerConsecuenciaParaEdicion/' + idConsecuencia;
				return DotService.Get(_url);
			}

			function ObtenerOperadoresDeCondicion() {
				var _url = 'Convenio/Clausula/ObtenerOperadoresDeCondicion';
				return DotService.Get(_url);
			}

			function ObtenerOperadorDeCondicion(idOperador) {
				var _url = 'Convenio/Clausula/ObtenerOperadorDeCondicion/' + idOperador;
				return DotService.Get(_url);
			}

			function ObtenerDimensiones() {
				var _url = 'Convenio/Clausula/ObtenerDimensiones';
				return DotService.Get(_url);
			}

			function ObtenerDimension(idDimension) {
				var _url = 'Convenio/Clausula/ObtenerDimension/' + idDimension;
				return DotService.Get(_url);
			}

			function ObtenerTiposConsecuencia() {
				var _url = 'Convenio/Clausula/ObtenerTiposConsecuencia';
				return DotService.Get(_url);
			}

			function ObtenerSubTiposConsecuencia() {
				var _url = 'Convenio/Clausula/ObtenerSubTiposConsecuencia';
				return DotService.Get(_url);
			}

			function ObtenerSubTipoConsecuencia(idSubtipo) {
				var _url = 'Convenio/Clausula/ObtenerSubTipoConsecuencia/' + idSubtipo;
				return DotService.Get(_url);
			}

			function TipoListaPrefacturablesObtenerTodos() {
				var _url = 'TipoListaPrefacturables/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function ImportarExcel(listaDto) {
				var _url = 'Convenio/ListaPrecios/ImportarExcel';
				return DotService.Post(_url, listaDto);
			}

			function ExportarExcel(id) {
				var _url = 'Convenio/ListaPrecios/ExportarExcel/' + id;
				return DotService.DownloadFile(_url, 'ListaPrecios.xlsx');
			}

			function ExportarPdf(id) {
				var _url = 'Convenio/ListaPrecios/ExportarPdf/' + id;
				return DotService.DownloadFile(_url, 'ListaPrecios.pdf');
			}

			function getNuevoDocumentoAsociadoDto() {
				var _url = 'DocumentoAsociado/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function ObtenerDimensionablesPorTipo(idDimensionable, idFinanciador) {
				var _url = 'Convenio/Clausula/ObtenerDimensionablesPorTipo/' + idDimensionable + '/' + idFinanciador;
				return DotService.Get(_url);
			}

			function ObtenerDimensionablePorTipoEId(idDimensionable, idElemento) {
				var _url = 'Convenio/Clausula/ObtenerDimensionablePorTipoEId/' + idDimensionable + '/' + idElemento;
				return DotService.Get(_url);
			}

			function ObtenerNuevoValorCondicionEditDto() {
				var _url = 'Convenio/Clausula/ObtenerNuevoValorCondicionEditDto/';
				return DotService.Get(_url);
			}

			function ObtenerCondicionConValoresFormateados(condicionDto) {
				var _url = 'Convenio/Clausula/ObtenerCondicionConValoresFormateados';
				return DotService.Post(_url, condicionDto);
			}

			function ObtenerConsecuenciaConValoresFormateados(consecuenciaDto) {
				var _url = 'Convenio/Clausula/ObtenerConsecuenciaConValoresFormateados';
				return DotService.Post(_url, consecuenciaDto);
			}

			function ObtenerNuevoValorConsecuenciaEditDto() {
				var _url = 'Convenio/Clausula/ObtenerNuevoValorConsecuenciaEditDto/';
				return DotService.Get(_url);
			}
			
			function ObtenerValoresPosiblesPorSubTipoConsecuencia(idSubtipo) {
				var _url = 'Convenio/Clausula/ObtenerValoresPosiblesPorSubTipoConsecuencia/' + idSubtipo;
				return DotService.Get(_url);
			}

			function GuardarClausulaEnConvenio(clausulaDto) {
				var _url = 'Convenio/Clausula/GuardarClausulaEnConvenio';
				return DotService.Post(_url, clausulaDto);
			}

			function ObtenerListasDePreciosConvenioParaSeleccion(idConvenio) {
				var _url = 'Convenio/ListaPrecios/ObtenerListasDePreciosConvenioParaSeleccion/' + idConvenio;
				return DotService.Get(_url);
			}

			function ObtenerRequisitosAdministrativosParaSeleccion(idConsecuencia) {
				var _url = 'Convenio/Clausula/ObtenerRequisitosAdministrativosParaSeleccion/' + idConsecuencia;
				return DotService.Get(_url);
			}

			function ObtenerListasPrefacturablesPorTipo(idFinanciador, idConvenio, idTipoPrefacturable) {
				var _url = 'Convenio/Clausula/ObtenerListasPrefacturablesPorTipo/0/'+idFinanciador+'/'+idConvenio+'/'+idTipoPrefacturable;
				return DotService.Get(_url);
			}

			function ObtenerNuevoConvenioCopyDto(idConvenio) {
				var _url = 'Convenio/ObtenerNuevoConvenioCopyDto/' + idConvenio;
				return DotService.Get(_url);
			}

			function CopiarConvenio(convenioCopyDto) {
				var _url = 'Convenio/CopiarConvenio';
				return DotService.Post(_url, convenioCopyDto);
			}

			function EliminarConvenio(idConvenio) {
				var _url = 'Convenio/Eliminar/' + idConvenio;
				return DotService.Post(_url,{});
			}

			function ObtenerTodosTiposMutual() {
				var _url = 'TipoMutual/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function ExportConveniosFiltrados(filtroDto){
				var _url = 'Convenio/ExportConveniosFiltrados';
				return DotService.DownloadFileDto(_url,"ListaConveniosFiltrados.xlsx",filtroDto);
			}
		}
	};

	return module;
})();