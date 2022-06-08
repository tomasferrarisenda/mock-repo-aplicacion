/**
* @author: rbassi
* @description: items Prefacturados para lote controller
* @type: Controller
**/
import * as angular from 'angular';
import { ISucursalDataService } from '../../../../support/basic/services/SucursalDataService'
import { IGruposPracticasCierresDataService } from '../../../configuraciones/gruposPracticasCierres/services/gruposPracticasCierresDataService'
import { IitemsPrefacturadosParaLoteDataService } from '../../services/itemsPrefacturadosParaLoteDataService'
import { ICierreRecepcionLogicService } from '../../../cierreRecepcion/services/cierreRecepcionLogicService'
import { filtroItemsPrefacturadosParaLoteDTO } from '../../models/filtroItemsPrefacturadosParaLoteDTO'


export class itemsPrefacturadosParaLoteListController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Items prefacturados para lotes', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..

 today: Date = new Date();

 fechaDesde: any;
 fechaHasta: any;
 fechaHoy: any;
 fechaDesdeMin: any;
 sucursalLista: IEntidadDto[] = [];
 sucursalElegida: IEntidadDto = {};
 servicioLista: IEntidadDto[] = [];
 servicioMedicoElegido: IEntidadDto = {}
 mutualElegida: any;
 itemsPrefacturados: any;
 filtroDTO : filtroItemsPrefacturadosParaLoteDTO = {};
 currentPage = 0
 idPaciente: number = 0
 recursoElegido: IEntidadDto = {};
 


 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','$state','DateUtils','SucursalDataService','GruposPracticasCierresDataService','AlertaService',
 'itemsPrefacturadosParaLoteDataService','CierreRecepcionLogicService'];
 /**
 * @class itemsPrefacturadosParaLoteListController
 * @constructor
 */
 constructor(private $log: ILogger,
	private $state,
	private DateUtils: IDateUtils,
	private SucursalDataService: ISucursalDataService,
	private GruposPracticasCierresDataService : IGruposPracticasCierresDataService,
	private AlertaService: IAlertaService,
	private itemsPrefacturadosParaLoteDataService: IitemsPrefacturadosParaLoteDataService,
	private cierreRecepcionLogicService: ICierreRecepcionLogicService,
	){
 }


 /**
 * @class itemsPrefacturadosParaLoteListController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('itemsPrefacturadosParaLoteListController');
 this.$log.debug('ON');
 this.activate();
 }


 changeFechaDesde(){
	 setTimeout(() => {
		this.fechaDesdeMin = angular.copy(this.fechaDesde);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate()- 1);
	 });
 }

 cambioSucursal(){
	if (this.sucursalElegida && this.sucursalElegida.Id) {
		this.GruposPracticasCierresDataService.ObtenerServiciosPorSucursal(this.sucursalElegida.Id).then((resultado) => {
			this.servicioLista = resultado;
		});
	}
	else{
		this.GruposPracticasCierresDataService.ObtenerTodosLosServicios().then((resultado) => {
			this.servicioLista = resultado;
		}); 
	}
};

verHistoricoItem(row: any){
	this.cierreRecepcionLogicService.historialCambiosSobreItem(row.Id).then((result) => {
	})
}

buscar() {
	if (!this.currentPage) this.currentPage = 1;
	this.buscarPagina({ currentPage: this.currentPage });
}

limpiarFiltros(){
	delete this.fechaDesde;
	delete this.fechaHasta;
	setTimeout(() => {
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
	});
	this.sucursalElegida = {};
	this.servicioMedicoElegido = {}
	this.mutualElegida = 0;
	this.idPaciente = 0
	this.recursoElegido = {}
	this.buscar();

}

 buscarPagina(pPaginacion){

	this.currentPage = pPaginacion.currentPage;
	var pageSize = pPaginacion.pageSize || 10;

	this.filtroDTO.CurrentPage = this.currentPage;
	this.filtroDTO.PageSize = pageSize;
	this.filtroDTO.FechaDesde = this.DateUtils.parseToBeParams(this.fechaDesde)? this.DateUtils.parseToBeParams(this.fechaDesde) :  this.DateUtils.parseToBeParams(new Date());
	this.filtroDTO.FechaHasta = this.DateUtils.parseToBeParams(this.fechaHasta)? this.DateUtils.parseToBeParams(this.fechaHasta) :  this.DateUtils.parseToBeParams(new Date());
	this.filtroDTO.IdServicio = this.servicioMedicoElegido && this.servicioMedicoElegido.Id ? this.servicioMedicoElegido.Id : 0;
	this.filtroDTO.IdFinanciador  = this.mutualElegida && this.mutualElegida.Id ? this.mutualElegida.Id : 0;
	this.filtroDTO.IdSucursal = this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0;
	this.filtroDTO.IdPaciente = this.idPaciente ? this.idPaciente : 0 ;
	this.filtroDTO.IdProfesional =  this.recursoElegido && this.recursoElegido.Id ? this.recursoElegido.Id : 0 ;
		this.itemsPrefacturadosParaLoteDataService.obtenerItemsParaLote(this.filtroDTO).then((result) => {
	 		this.itemsPrefacturados = result
		 }) 

 }

 volver() {
	this.$state.go('homesistemas');
}


activate(){
	this.fechaDesde = this.today;
	this.fechaHasta = this.today;
	this.fechaDesdeMin = angular.copy(this.fechaDesde);
	this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);

	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales
		this.cambioSucursal(); 
		this.buscar(); 
	});
}

 // #endregion
}