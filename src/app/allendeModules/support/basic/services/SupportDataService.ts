/**
* @author:         emansilla
* @description:    Llamadas de datos de soporte
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { PrefacturableDto } from '../../models';

export interface ISupportDataService {
	entidadesBuscador;
	tituloBuscador;
	mostrarIdBuscador;
	mostrarCodigoBuscador;
	mostrarNombreBuscador;
	mostrarDescripcionBuscador;
	tituloIdBuscador;
	tituloCodigoBuscador;
	tituloNombreBuscador;
	tituloDescripcionBuscador;
	filtroBusquedaPacienteTipoDoc;
	filtroBusquedaPacienteNumeroDoc;
	filtroBusquedaRecursoTipo;
	filtroBusquedaRecursoNumeroMatric;
	
	obtenerEstadoEmpadronamiento();
	/**
	 * [EntityFramework] Se usa para internacion
	 */
	getAllTiposDocumento();
	obtenerTodosTipoDocumento();
	getAllTipoAfiliado();
	getAllTipoAfiliadoSinAmbos();
	getAllEstadosCivil();
	obtenerTodosEstadoCivil();
	getAllAlicuotasIva();
	getAllCondicionImpositiva();
	getAllTipoMutual();
	getAllTiposPorcentaje();
	obtenerTodosPaises();
	getFirmaMedico(pNumeroMatricula);
	obtenerTodosTipoResponsable();
	getInternados(pFiltroInternados);
	getPracticas(pFiltroPractica);
	getAllServicioMedico();
	getAllCoberturasPaciente(pPaciente);
	ObtenerNuevoPorPaciente(idPlanMutual, idTipoAfiliado, nroAfiliado);
	ObtenerPrefacturablePorFiltro(filtroPrefacturable);
	ObtenerPrefacturablePorId(idTipo, idPrefacturable): angular.IPromise<PrefacturableDto>;
	obtenerTiposParticipante();
	CrearParticipanteItemPrefacturado();
	obtenerSalasXSucursal(pIdSucursal);
	obtenerConsultoriosXSala(pIdSala);
	obtenerTodosLosSistemasApp();
	getAllTiposEstudios();

	// seguimiento patologia para v1
	obtenerActivosDelPacienteParaAletaAdministrativa(pIdPaciente);

}

class dataService implements ISupportDataService {
	entidadesBuscador;
	tituloBuscador;
	mostrarIdBuscador;
	mostrarCodigoBuscador;
	mostrarNombreBuscador;
	mostrarDescripcionBuscador;
	tituloIdBuscador;
	tituloCodigoBuscador;
	tituloNombreBuscador;
	tituloDescripcionBuscador;
	filtroBusquedaPacienteTipoDoc;
	filtroBusquedaPacienteNumeroDoc;
	filtroBusquedaRecursoTipo;
	filtroBusquedaRecursoNumeroMatric;

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('SupportDateService');
		this.$log.debug('ON');
	}

	public obtenerEstadoEmpadronamiento() {
		var _url = 'EstadoEmpadronamiento/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public getAllTiposDocumento() {
		var _url = 'legacy/TipoDocumento/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public obtenerTodosTipoDocumento() {
		var _url = 'TipoDocumento/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllTipoAfiliado() {
		var _url = 'TipoAfiliado/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllTipoAfiliadoSinAmbos() {
		var _url = 'TipoAfiliado/SinAmbos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllEstadosCivil() {
		var _url = 'legacy/EstadoCivil/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public obtenerTodosEstadoCivil() {
		var _url = 'EstadoCivil/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllAlicuotasIva() {
		var _url = 'AlicuotaIva/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllCondicionImpositiva() {
		var _url = 'Facturacion/Comun/CondicionIva/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllTipoMutual() {
		var _url = 'TipoMutual/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllTiposPorcentaje() {
		var _url = 'legacy/TipoPorcentaje/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public obtenerTodosPaises() {
		var _url = 'Pais/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getFirmaMedico(pNumeroMatricula) {
		var _url = 'UsuarioMedico/GetFirma/' + pNumeroMatricula;
		return this.DtoService.Get(_url);
	}

	public obtenerTodosTipoResponsable() {
		var _url = 'TipoRelacionPaciente/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getInternados(pFiltroInternados) {
		var _url = 'NuevaInternacion/ObtenerInternadosParaModal/';
		return this.DtoService.Post(_url, pFiltroInternados, { isDictionary: true });
	}

	public getPracticas(pFiltroPractica) {
		var _url = 'Facturacion/GetByCodigoFacturacionModal/';
		return this.DtoService.Post(_url, pFiltroPractica, { isDictionary: true });
	}

	public getAllServicioMedico() {
		var _url = 'Servicio/ObtenerTodos/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllCoberturasPaciente(pPaciente) {
		var _url = 'Cobertura/ObtenerPorIdPaciente/' + pPaciente;
		return this.DtoService.Get(_url);
	}

	public ObtenerNuevoPorPaciente(idPlanMutual, idTipoAfiliado, nroAfiliado) {
		var _url = 'Cobertura/ObtenerNuevoPorPaciente/' + idPlanMutual + '/' + idTipoAfiliado + '/' + nroAfiliado;
		return this.DtoService.Get(_url);
	}

	public ObtenerPrefacturablePorFiltro(filtroPrefacturable) {
		var _url = 'Prefacturable/ObtenerPorFiltro/';
		return this.DtoService.Post(_url, filtroPrefacturable, { isDictionary: true });
	}

	public ObtenerPrefacturablePorId(idTipo, idPrefacturable) {
		var _url = 'Prefacturable/ObtenerPorId/' + idTipo + '/' + idPrefacturable;
		return this.DtoService.Get(_url);
	}

	public obtenerTiposParticipante() {
		var _url = 'TipoComponente/ObtenerTodos/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public CrearParticipanteItemPrefacturado() {
		var _url = 'PrefacturacionAmbulatoria/CrearParticipanteItemPrefacturado/';
		return this.DtoService.Get(_url);
	}

	public obtenerSalasXSucursal(pIdSucursal) {
		var _url = 'SalaDeEspera/ObtenerPorSucursal/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public obtenerConsultoriosXSala(pIdSala) {
		var _url = 'Consultorios/ObtenerPorSala/' + pIdSala;
		return this.DtoService.Get(_url);
	}

	public obtenerTodosLosSistemasApp() {
		var _url = 'Sistema/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllTiposEstudios() {
		var _url = 'TipoEstudio/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public obtenerActivosDelPacienteParaAletaAdministrativa(idPaciente) { 
		var _url = 'SSP/SeguimientoSospechaPatologia/ObtenerActivosDelPacienteParaAletaAdministrativa/' + idPaciente;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class SupportDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('SupportDataService', dataService.serviceFactory)
	}
}