/**
* @author: rbassi
* @description: grupos practicas cierres controller
* @type: Controller
**/
import * as angular from 'angular';
import { ISucursalDataService } from "../../../../../support/basic/services/SucursalDataService";
import { IGruposPracticasCierresDataService } from '../../services/gruposPracticasCierresDataService';
import { IGruposPracticasCierresLogicService } from '../../services/gruposPracticasCierresLogicService';


export class gruposPracticasCierresListController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Configuración de Grupos de Prácticas para Cierre', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..

 sucursalLista: IEntidadDto[] = [];
 sucursalElegida: IEntidadDto = {};
 servicioLista: IEntidadDto[] = [];
 servicioMedicoElegido: IEntidadDto = {}
 gruposPracticas: {} = {}
 currentPage = 0;

 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject: Array<string> = ['Logger', '$state', 'GruposPracticasCierresDataService', 'GruposPracticasCierresLogicService', 'SucursalDataService','ModalService','AlertaService'];

/**
 * @class gruposPracticasCierresListController
 * @constructor
 */
 constructor(
	private $log: ILogger,
	private $state,
	private GruposPracticasCierresDataService: IGruposPracticasCierresDataService,
	private GruposPracticasCierresLogicService: IGruposPracticasCierresLogicService,
	private SucursalDataService: ISucursalDataService,
	private ModalService: IModalService,
	private AlertaService: IAlertaService,
	){
 }

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class gruposPracticasCierresListController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('gruposPracticasCierresListController');
 this.$log.debug('ON');
 this.activate();
 }

buscar(){
	if (!this.currentPage) this.currentPage = 1;
	this.buscarPagina({ currentPage: this.currentPage });
};

buscarPagina(pPaginacion) {
	this.currentPage = pPaginacion.currentPage;
	var pageSize = pPaginacion.pageSize || 10;

	let idSucursal = this.sucursalElegida && this.sucursalElegida.Id? this.sucursalElegida.Id : 0;
	let idServicio = this.servicioMedicoElegido && this.servicioMedicoElegido.Id? this.servicioMedicoElegido.Id : 0;

	this.GruposPracticasCierresDataService.ObtenerGruposPracticasParaCierre(idSucursal,idServicio)
	.then((grupoPracticas) => {
		this.gruposPracticas = grupoPracticas
		this.$log.debug('grupo de Practicas', this.gruposPracticas);
	});
}

limpiarFiltros() {
	/*Para limpiar los Filtros de Busqueda */
	this.sucursalElegida = {};
	this.servicioMedicoElegido = {};
	this.cambioSucursal(); 
}

cambioSucursal(){
	this.$log.debug('sucursalElegida', this.sucursalElegida);
	if (this.sucursalElegida && this.sucursalElegida.Id) {
		this.GruposPracticasCierresDataService.ObtenerServiciosPorSucursal(this.sucursalElegida.Id).then((resultado) => {
			this.servicioLista = resultado;
			this.$log.debug('servicio Lista Por Sucursal', this.servicioLista);
		});
	}
	else{
		this.GruposPracticasCierresDataService.ObtenerTodosLosServicios().then((resultado) => {
			this.$log.debug('Traer todos los servicios', resultado);
			this.servicioLista = resultado;
			this.$log.debug('servicio Lista TODOS', this.servicioLista);
		}); 
	}
};

cambioServicioMedico(){
	this.$log.debug('servicioElegida', this.servicioMedicoElegido);
};

volver() {
	this.$state.go('homesistemas');
}

editarGrupoPracticas(idGrupoPracticas: number, index: number){
	this.GruposPracticasCierresLogicService.editarGrupoPracticasCierres(idGrupoPracticas)
	.then((result) => {
		//this.$log.debug('result Modal', result);
		this.buscar();
	});

};

eliminar(fila: any, index: number){
	this.ModalService.confirm('¿Desea eliminar la configuración de ' +fila.Servicio + '?', (pResult) => {
		if (pResult) {
			this.GruposPracticasCierresDataService.eliminar(fila.Id).then((result) => {
				if (result.IsOk) {
					this.AlertaService.NewSuccess("La configuración ha sido eliminada.");
					this.buscar();
				}
			});
			
		}
	});
};


activate(){
	// traigo todas las sucursales
	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales
		this.cambioSucursal();
	});
	this.buscar();
};

 // #endregion
}	