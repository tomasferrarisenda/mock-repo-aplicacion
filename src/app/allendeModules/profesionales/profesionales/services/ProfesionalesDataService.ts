/**
* @author:         emansilla
* @description:    Profesionales data
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IProfesionalesDataService {
	matriculaBusqueda;
	nombreBusqueda;
	apellidoBusqueda;
	currentPage;

	getProfesionales();

	getAllProfesional();
	getProfesionalByMatricula(matricula);
 
	ObtenerNuevoProfesionalDto();
	ObtenerProfesionalesPorFiltros(filtroDto);
	ObtenerProfesionalParaEdicion(id);
	ObtenerFiltroBusquedaProfesionalesDto();
	guardarProfesional(profesionalDto);
	ObtenerTodosEspecialidadMedica();
	ObtenerTodosTipoProfesional();
	ObtenerTodosTipoDocumento();
	ObtenerTodosTipoSexo();
	ObtenerTodosServicios();
	EliminarSeguroDelProfesionalPorId(id);
	SeguroGuardar(dto);
	CompaniasObtenerTodos();
	SeguroObtenerPorId(id);
	SeguroObtenerNuevo();
	EliminarProfesional(id);
	EliminarConfiguracionPorId(id);
	ConfiguracionGuardar(configuracion);
	SucursalObtenerTodos();
	ServicioObtenerTodos();
	PrestacionMedicaObtenerTodos();
	DiaSemanaObtenerTodos();
	TipoDeSemanaObtenerTodos();
	ConfiguracionObtenerPorId(idConfiguracion);
	ConfiguracionObtenerNuevo();

	ProfesionalObtenerTodos();
	ProfesionalObtenerPorMatricula(matricula);
	ProfesionalAtencionObtenerNuevo();
	ProfesionalObtenerFiltroBusqueda();
	ProfesionalObtenerPorFiltroBusqueda(filtroProfesional);
	exportarListaToXls(matricula, nombre, apellido, currentPage, pageSize);
	GetNuevoDocumentoAsociadoDto();
	ObtenerTodosTipoCategorias();

	getProfesionalesInternos();
	getProfesionalesSolicitantes();
	/**
	 * @description Se llama por Post pero no se envían datos
	 */
	getProfesionalPorMatricula(pMatriculaProfesional);
	/**
	 * @description Se llama por Post pero no se envían datos
	 */
	getProfesionalSolicitantePorMatricula(pMatriculaProfesional);
	getAllTipoProfesionales();

	/**
	 * [EntityFramework]
	 */
	getOneProfesionalByMatricula(numeroMatricula: number);
	/**
	 * [EntityFramework]
	 */
	getAllProfesionales();
	/**
	 * [EntityFramework]
	 */
	getProfesionalById(idProfesional: number);

	// endpoint para profesionales que atienden
	obtenerQueAtiendenAlRecurso(pIdRecurso: number, pIdTipoRecurso: number);

	obtenerPorServicioConRecursosEnQueAtienden(pIdServicio);

	companiaSegurosObtnerPorNombre(pNombre);
}

class dataService implements IProfesionalesDataService {

	matriculaBusqueda;
	nombreBusqueda;
	apellidoBusqueda;
	currentPage;

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ProfesionalesDateService');
		this.$log.debug('ON');
	}

	public getProfesionales() {
		var _url = 'Profesional/ObtenerTodosLista';
		return this.DtoService.Get(_url);
	}

	public getAllProfesional() {
		var _url = 'Profesional/GetParaBusqueda';
		return this.DtoService.Get(_url);
	}

	public getProfesionalByMatricula(matricula) {
		var _url = 'legacy/Profesional/GetByMatricula/' + matricula;
		return this.DtoService.Get(_url);
	}

	public ObtenerNuevoProfesionalDto() {
		var _url = 'Profesional/ObtenerNuevo';
		return this.DtoService.Get(_url);
	}

	public ObtenerProfesionalesPorFiltros(filtroDto) {
		var _url = 'Profesional/ObtenerPorFiltroBusqueda';
		return this.DtoService.Post(_url, filtroDto);
	}

	public ObtenerProfesionalParaEdicion(id) {
		var _url = 'Profesional/ObtenerPorId/' + id;
		return this.DtoService.Get(_url);
	}

	public ObtenerFiltroBusquedaProfesionalesDto() {
		var _url = 'Profesional/ObtenerFiltroBusqueda';
		return this.DtoService.Get(_url);
	}

	public guardarProfesional(profesionalDto) {
		var _url = 'Profesional/Guardar';
		return this.DtoService.Post(_url, profesionalDto);
	}

	public ObtenerTodosEspecialidadMedica() {
		var _url = 'Comun/EspecialidadMedica/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public ObtenerTodosTipoProfesional() {
		var _url = 'TipoDeProfesional/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public ObtenerTodosTipoCategorias() {
		var _url = 'CategoriaDelProfesional/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public ObtenerTodosTipoDocumento() {
		var _url = 'TipoDocumento/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public ObtenerTodosTipoSexo() {
		var _url = 'TipoSexo/ObtenerSoloMascYFem';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public ObtenerTodosServicios(){
		var _url = 'Servicio/ObtenerTodos/false/false';
		return this.DtoService.Get(_url);
	}

	public EliminarSeguroDelProfesionalPorId(id) {
		var _url = 'SeguroDelProfesional/Eliminar/' + id;
		return this.DtoService.Get(_url);
	}

	public SeguroGuardar(dto) {
		var _url = 'SeguroDelProfesional/Guardar';
		return this.DtoService.Post(_url, dto);
	}

	public CompaniasObtenerTodos() {
		var _url = 'CompaniaSeguro/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public SeguroObtenerPorId(id) {
		var _url = 'SeguroDelProfesional/ObtenerPorId/' + id;
		return this.DtoService.Get(_url);
	}

	public SeguroObtenerNuevo() {
		var _url = 'SeguroDelProfesional/ObtenerNuevo';
		return this.DtoService.Get(_url);
	}

	public EliminarProfesional(id) {
		var _url = 'Profesional/Eliminar/' + id;
		return this.DtoService.Get(_url);
	}

	public ProfesionalObtenerTodos() {
		var _url = 'Profesional/ObtenerTodosSelector';
		return this.DtoService.Get(_url);
	}

	public ProfesionalObtenerPorMatricula(matricula) {
		var _url = 'Profesional/ObtenerPorMatricula/' + matricula;
		return this.DtoService.Get(_url);
	}

	public ProfesionalAtencionObtenerNuevo (){
		var _url = 'Comun/ProfesionalAtiendeRecursoController/ObtenerNuevo';
		return this.DtoService.Get(_url)
	}

	public ProfesionalObtenerFiltroBusqueda() {
		var _url = 'Profesional/ObtenerFiltroBusqueda';
		return this.DtoService.Get(_url);
	}

	public ProfesionalObtenerPorFiltroBusqueda(filtroProfesional) {
		var _url = 'Profesional/ObtenerPorFiltroBusqueda';
		return this.DtoService.Post(_url, filtroProfesional);
	}

	public getProfesionalesInternos() {
		var _url = 'Profesional/ObtenerInternos/';
		return this.DtoService.Get(_url);
	}

	public getProfesionalesSolicitantes() {
		var _url = 'ProfesionalSolicitante/ObtenerProfesionalesSolicitantes/';
		return this.DtoService.Get(_url);
	}

	public getProfesionalPorMatricula(pMatriculaProfesional) {
		var _url = 'Profesional/GetInternoPorMatriculaConCuentas/' + pMatriculaProfesional;
		return this.DtoService.Get(_url);
	}

	public getProfesionalSolicitantePorMatricula(pMatriculaProfesional) {
		var _url = 'ProfesionalSolicitante/ObtenerSolicitantesPorMatricula/' + pMatriculaProfesional;
		return this.DtoService.Get(_url);
	}

	public getAllTipoProfesionales() {
		var _url = 'TipoProfesionalSolicitante/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public exportarListaToXls(matricula, nombre, apellido, currentPage, pageSize) {
		var _url = 'Profesional/ExportListToExcel/'+matricula+'/'+nombre+'/'+apellido+'/'+currentPage+'/'+pageSize;
		return this.DtoService.DownloadFile(_url, 'Profesionales.xlsx');
	}

	public GetNuevoDocumentoAsociadoDto() {
		var _url = 'DocumentoAsociado/ObtenerNuevo';
		return this.DtoService.Get(_url);
	}

	public EliminarConfiguracionPorId(id) {
		var _url = 'ConfiguracionProfesionalDefecto/Eliminar/' + id;
		return this.DtoService.Get(_url);
	}

	public ConfiguracionGuardar(configuracion){
		var _url = 'ConfiguracionProfesionalDefecto/Guardar';
		return this.DtoService.Post(_url, configuracion);
	}

	public SucursalObtenerTodos () {
		var _url = 'Sucursal/ObtenerTodas';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public ServicioObtenerTodos () {
		var _url = 'Servicio/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public PrestacionMedicaObtenerTodos () {
		var _url = 'PrestacionMedica/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public DiaSemanaObtenerTodos () {
		var _url = 'DiaSemana/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public TipoDeSemanaObtenerTodos () {
		var _url = 'TipoDeNumero/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public ConfiguracionObtenerPorId(idConfiguracion){
		var _url = 'ConfiguracionProfesionalDefecto/ObtenerPorId/'+ idConfiguracion;
		return this.DtoService.Get(_url);
	}

	public ConfiguracionObtenerNuevo(){
		var _url = 'ConfiguracionProfesionalDefecto/ObtenerNuevo';
		return this.DtoService.Get(_url);
	}


	/**
	 * [EntityFramework]
	 * @param pNumeroMatricula 
	 */
	public getOneProfesionalByMatricula(pNumeroMatricula) {
		var _url = 'legacy/Profesional/' + pNumeroMatricula;
		return this.DtoService.Get(_url);
	}

	/**
	 * [EntityFramework]
	 */
	public getAllProfesionales() {
		var _url = 'legacy/Profesional/';
		return this.DtoService.Get(_url);
	}

	/**
	 * [EntityFramework]
	 * @param idProfesional 
	 */
	public getProfesionalById(idProfesional) {
		var _url = 'legacy/Profesional/' + idProfesional;
		return this.DtoService.Get(_url);
	}

	public obtenerQueAtiendenAlRecurso(pIdRecurso, pIdTipoRecurso){
		var _url = 'Profesional/ObtenerQueAtiendenAlRecurso/' + pIdRecurso + '/' + pIdTipoRecurso;
		return this.DtoService.Get(_url);
	}

	public obtenerPorServicioConRecursosEnQueAtienden(pIdServicio: number){
		var _url = 'Profesional/ObtenerPorServicioConRecursosEnQueAtienden/' + pIdServicio;
		return this.DtoService.Get(_url);
	}


	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}

	public companiaSegurosObtnerPorNombre(pNombre){
		var _url = 'CompaniaSeguro/ObtenerPorNombre' + pNombre;
		return this.DtoService.Get(_url);
	}
	
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class ProfesionalesDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ProfesionalesDataService', dataService.serviceFactory)
	}
}