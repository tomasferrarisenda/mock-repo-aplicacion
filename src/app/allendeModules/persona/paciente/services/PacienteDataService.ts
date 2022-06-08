/**
* @author:         emansilla
* @description:    Data de Pacientes
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IPacienteDataService {
	nuevoPaciente(): angular.IPromise<any>;
	nuevoPacienteConDocumento(pIdTipoDocumento, pNumeroDocumento): angular.IPromise<any>;
	nuevoPacienteConDocumentoYNombreApellido(pIdTipoDocumento, pNumeroDocumento, pNombrePaciente, pApellidoPaciente): angular.IPromise<any>;
	newPaciente(): angular.IPromise<any>;
	addOnePaciente(pPaciente): angular.IPromise<any>;
	// getAllTelefonosByPaciente(pClavePaciente): angular.IPromise<any>;
	updateAllTelefonosByPaciente(pPaciente): angular.IPromise<any>;
	// addTelefonoPaciente(pIdTelefono, pTelefono): angular.IPromise<any>;
	getOnePacienteByDocumento(pClaveTipoDocumento, pNumeroDocumento): angular.IPromise<any>;
	getOnePacienteByNombreAndNacimiento(pNombrePaciente, pFechaNacimiento): angular.IPromise<any>;
	getAllPacienteByDocumento(pClaveTipoDocumento, pNumeroDocumento): angular.IPromise<any>;
	obtenerPacientePorDocumento(pIdTipo, pNumeroDocumento): angular.IPromise<any>;
	obtenerPacientePorDocumentoSelector(pIdTipo, pNumeroDocumento): angular.IPromise<any>;
	obtenerPacienteConSimilares(pFiltros): angular.IPromise<any>;
	obtenerPacienteConSimilaresSinGrid(pIdTipo, pNumeroDocumento, pNombrePaciente, pApellidoPaciente): angular.IPromise<any>;
	generarCriterioBusqueda(): angular.IPromise<any>;
	getOnePacienteByNombre(pNombrePaciente): angular.IPromise<any>;
	getOnePacienteByClave(pClavePaciente): angular.IPromise<any>;
	updateOnePaciente(pPaciente): angular.IPromise<any>;
	guardarPaciente(pPaciente): angular.IPromise<any>;
	getEstadosRegistroPacired(): angular.IPromise<any>;
	obtenerTodosEstadoEmpadronamiento(): angular.IPromise<any>;
	obtenerEstadoEmpadronamientoPorPermisos(): angular.IPromise<any>;
	getTiposRelacionPaciente(): angular.IPromise<any>;
	getNuevaCobertura(): angular.IPromise<any>;
	obteneCoberturasPaciente(idPaciente): angular.IPromise<any>;
	obtenerPacientePorId(idPaciente): angular.IPromise<any>;
	obtenerPacientePorIdSelector(idPaciente): angular.IPromise<any>;
	obtenerPacientePorIdEditar(idPaciente): angular.IPromise<any>;
	obtenerPacientePorIdEditarViejo(idPaciente): angular.IPromise<any>;	
	ObtenerPacientePorNombreCompleto(nombrePaciente): angular.IPromise<any>;
	obtenerNuevoPacienteResponsable (idPaciente): angular.IPromise<any>;
	obtenerNuevoPacienteAcargo (idPaciente): angular.IPromise<any>;
	getPacientesByFiltro(idTipoDocumento, numeroDocumento, nombre): angular.IPromise<any>;
	obtenerTodosTipoPaciente(): angular.IPromise<any>;
	validarGuardarPaciente(pPaciente): angular.IPromise<any>;
}

class dataService implements IPacienteDataService {

	idPaciente = 0;

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('PacienteDateService');
		this.$log.debug('ON');
	}

	public nuevoPaciente() {
		var _url = 'Paciente/ObtenerNuevoPaciente/';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public nuevoPacienteConDocumento(pIdTipoDocumento, pNumeroDocumento) {
		var _url = 'Paciente/ObtenerNuevoPacienteConDocumento/' + pIdTipoDocumento + '/' + pNumeroDocumento;
		return this.DtoService.Get(_url);
	}

	public nuevoPacienteConDocumentoYNombreApellido(pIdTipoDocumento, pNumeroDocumento, pNombrePaciente, pNombreApellido){
		var _url = 'Paciente/ObtenerNuevoPacienteConDocumentoYNombreApellido/' + pIdTipoDocumento + '/' + pNumeroDocumento
			+ '/' + pNombrePaciente + '/' + pNombreApellido;
		return this.DtoService.Get(_url);
	}

	public newPaciente() {
		var _url = 'legacy/PacienteMedico/New/';
		return this.DtoService.Get(_url);
	}

	public addOnePaciente(pPaciente) {
		var _url = 'legacy/PacienteMedico/Add/';
		return this.DtoService.Post(_url, pPaciente);
	}

	// public getAllTelefonosByPaciente(pClavePaciente) {
	// 	var _url = 'Telefono/GetByPaciente/' + pClavePaciente;
	// 	return this.DtoService.Get(_url);
	// }

	public updateAllTelefonosByPaciente(pPaciente) {
		var _url = 'Telefono/UpdateByPaciente/';
		return this.DtoService.Post(_url, pPaciente);
	}

	// public addTelefonoPaciente(pIdTelefono, pTelefono) {
	// 	var _url = 'PacienteMedico/AddTelefono/' + pIdTelefono;
	// 	return this.DtoService.Post(_url, pTelefono);
	// }

	public getOnePacienteByDocumento(pClaveTipoDocumento, pNumeroDocumento) {
		var _url = 'legacy/PacienteMedico/GetByDocumento/' + pClaveTipoDocumento + '/' + pNumeroDocumento;
		return this.DtoService.Get(_url);
	}

	public getOnePacienteByNombreAndNacimiento(pNombrePaciente, pFechaNacimiento) {
		var _url = 'legacy/PacienteMedico/GetByNombreAndNacimiento/' + pNombrePaciente + '/' + pFechaNacimiento;
		return this.DtoService.Get(_url);
	}

	public getAllPacienteByDocumento(pClaveTipoDocumento, pNumeroDocumento) {
		var _url = 'legacy/PacienteMedico/GetAllByDocumento/' + pClaveTipoDocumento + '/' + pNumeroDocumento;
		return this.DtoService.Get(_url);
	}
	
	/**
	 * Por ado copia usa Jorge
	 */
	public obtenerPacientePorDocumento(pIdTipo, pNumeroDocumento) {
		var _url = 'Paciente/ObtenerPorTipoYNumeroDocumento/' + pIdTipo + '/' + pNumeroDocumento;
		return this.DtoService.Get(_url);
	}

	public obtenerPacientePorDocumentoSelector(pIdTipo, pNumeroDocumento) {
		var _url = 'Paciente/ObtenerPorTipoYNumeroDocumentoSelector/' + pIdTipo + '/' + pNumeroDocumento;
		return this.DtoService.Get(_url);
	}

	public obtenerPacienteConSimilares(pFiltros) {
		var _url = 'Paciente/ObtenerParaBusquedaConSimilares';
		return this.DtoService.Post(_url, pFiltros);
	}

	/**
	 * @deprecated - Proximanente
	 */
	public obtenerPacienteConSimilaresSinGrid(pIdTipo, pNumeroDocumento, pNombrePaciente, pApellidoPaciente) {
		var _url = 'Paciente/ObtenerParaBusquedaConSimilaresSinGrid/' + pIdTipo + '/' + pNumeroDocumento + '/' +
			pNombrePaciente + '/' + pApellidoPaciente;
		return this.DtoService.Get(_url);
	}

	public generarCriterioBusqueda() {
		var _url = 'Paciente/CrearCriterioDeBusqueda';
		return this.DtoService.Get(_url, { isCachable: true });
	}


	// ObtenerPorTipoYNumeroDocumentoEdad(pIdTipo, pNumeroDocumento,pEdad) {
	// 		var _url = 'Paciente/ObtenerPorTipoYNumeroDocumentoEdad/' + pIdTipo + '/' + pNumeroDocumento
	// 		 +'/'+pEdad;
	// 		return this.DtoService.Get(_url);		
	// 	}

	public getOnePacienteByNombre(pNombrePaciente) {
		var _url = 'legacy/PacienteMedico/GetByNombre/' + pNombrePaciente;
		return this.DtoService.Get(_url);
	}

	public getOnePacienteByClave(pClavePaciente) {
		var _url = 'legacy/PacienteMedico/' + pClavePaciente;
		return this.DtoService.Get(_url);
	}

	public updateOnePaciente(pPaciente) {
		var _url = 'legacy/PacienteMedico/Update/';
		return this.DtoService.Post(_url, pPaciente);
	}
	
	/**
	 * Falta terminar el back
	 */
	public guardarPaciente(pPaciente) {
		//$log.debug('guardar paciente: ',pPaciente);
		var _url = 'Paciente/Guardar';
		return this.DtoService.Post(_url, pPaciente);
	}

	public getEstadosRegistroPacired() {
		var _url = 'legacy/EstadoRegistroPacired/';
		return this.DtoService.Get(_url);
	}

	public obtenerTodosEstadoEmpadronamiento() {
		var _url = 'EstadoEmpadronamiento/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public obtenerEstadoEmpadronamientoPorPermisos() {
		var _url = 'EstadoEmpadronamiento/ObtenerPorPermiso';
		return this.DtoService.Get(_url);
	}
	public getTiposRelacionPaciente() {
		var _url = 'TipoRelacionPaciente/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	// getNuevaCobertura (pPlan) {
	// 	var _url = 'Cobertura/ObtenerNuevo/';
	// 	return this.DtoService.Post(_url, pPlan);
	// }

	public getNuevaCobertura() {
		var _url = 'Cobertura/ObtenerNuevoDto';
		return this.DtoService.Get(_url);
	}
	public obteneCoberturasPaciente(idPaciente) {
		var _url = 'Cobertura/ObtenerPorIdPaciente/' + idPaciente;
		return this.DtoService.Get(_url);
	}

	public obtenerPacientePorId(idPaciente) {
		var _url = 'Paciente/ObtenerPorId/' + idPaciente;
		return this.DtoService.Get(_url);
	}

	public obtenerPacientePorIdSelector(idPaciente) {
		var _url = 'Paciente/ObtenerPorIdSelector/' + idPaciente;
		return this.DtoService.Get(_url);
	}

	public obtenerPacientePorIdEditar(idPaciente) {
		var _url = 'Paciente/ObtenerPorIdEditar/' + idPaciente;
		return this.DtoService.Get(_url);
	}

	public obtenerPacientePorIdEditarViejo(idPaciente) {
		var _url = 'Paciente/ObtenerPorIdExternoEditar/' + idPaciente;
		return this.DtoService.Get(_url);
	}

	public ObtenerPacientePorNombreCompleto(nombrePaciente) {
		var _url = 'Paciente/ObtenerPorNombreCompleto/' + nombrePaciente;
		return this.DtoService.Get(_url);
	}
	public obtenerNuevoPacienteResponsable (idPaciente) {
		var _url = 'PacienteRelacionado/ObtenerNuevoPacienteResponsable/' + idPaciente;
		return this.DtoService.Get(_url);	
	}

	public obtenerNuevoPacienteAcargo (idPaciente) {
		var _url = 'PacienteRelacionado/ObtenerNuevoPacienteAcargo/' + idPaciente;
		return this.DtoService.Get(_url);	
	}

	public getPacientesByFiltro(idTipoDocumento, numeroDocumento, nombre) {
		if (nombre == null || angular.isUndefined(nombre) || nombre == '') {
			nombre = ' ';
		}
		var _url = 'Paciente/ObtenerPorFiltro/' + nombre + '/' + numeroDocumento + '/' + idTipoDocumento;
		return this.DtoService.Get(_url);
	}

	public obtenerTodosTipoPaciente() {
		var _url = 'TipoPaciente/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}
	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}

	public validarGuardarPaciente(pPaciente) {
		//$log.debug('guardar paciente: ',pPaciente);
		var _url = 'Paciente/ValidarGuardar';
		return this.DtoService.Post(_url, pPaciente);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class PacienteDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PacienteDataService', dataService.serviceFactory)
	}
}