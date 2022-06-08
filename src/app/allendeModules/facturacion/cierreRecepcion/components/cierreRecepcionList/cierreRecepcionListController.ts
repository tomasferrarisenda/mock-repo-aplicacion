/**
* @author: rbassi
* @description: cierre recepcion controller
* @type: Controller
**/
import * as angular from 'angular';
import { ISucursalDataService } from '../../../../support/basic/services/SucursalDataService'
import { ICierreRecepcionDataService } from '../../services/cierreRecepcionDataService';
import { ICierreRecepcionLogicService } from '../../services/cierreRecepcionLogicService';
import { filtroCierreRecepcionDTO } from '../../models';
import { IGruposPracticasCierresDataService } from '../../../configuraciones/gruposPracticasCierres/services/gruposPracticasCierresDataService';
import { ICredentialsDataService } from 'core/security';
import { IRecepcionTurnosStorageHelperService } from '../../../../recepcionTurnos/services/RecepcionTurnosStorageHelperService';
//import {User} from ''
export class cierreRecepcionListController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Cierres de Recepción', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 
 today = new Date();

 filtroDto : filtroCierreRecepcionDTO = {};
 guardarFiltroDto: filtroCierreRecepcionDTO = {};
 cierreRecepcion: any;
 fechaDesde = new Date();
 fechaHasta = new Date();
 fechaHoy = new Date();
 fechadesdeMin = new Date();
 sucursalLista: IEntidadDto[] = [];
 sucursalElegida: IEntidadDto = {};
 servicioLista: IEntidadDto[] = [];
 servicioMedicoElegido: IEntidadDto = {}
 numeroCierre: number = 0;
 usuarioElegido: IEntidadDto= {};
 usuarioActual: IEntidadDto= {};
 jerarquia: any[] = [];
 loading: boolean = false;
 currentPage = 0;
 storageKeys = {
	keyCierreRecepcion: "cierre-recepcion"
}
busquedaUsuario: any;
cierreRecepcionDetalle: any = {};




 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject: Array<string> = ['Logger', '$state', 'CierreRecepcionDataService', 'CierreRecepcionLogicService', 'SucursalDataService','ModalService'
 ,'AlertaService','DateUtils','GruposPracticasCierresDataService','CredentialsDataService', 'UsuarioGestionDataService','RecepcionTurnosStorageHelperService','moment',
 'CierreRecepcionLogicService'];

/**
 * @class gruposPracticasCierresListController
 * @constructor
 */
 constructor(
	private $log: ILogger,
	private $state,
	private cierreRecepcionDataService: ICierreRecepcionDataService,
	private ICierreRecepcionLogicService: ICierreRecepcionLogicService,
	private SucursalDataService: ISucursalDataService,
	private ModalService: IModalService,
	private AlertaService: IAlertaService,
	private DateUtils : IDateUtils,
	private GruposPracticasCierresDataService : IGruposPracticasCierresDataService,
	private CredentialsDataService: ICredentialsDataService,
	private UsuarioGestionDataService,
	private StorageService: IRecepcionTurnosStorageHelperService,
	private moment,

	){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionListController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionListController');
 this.$log.debug('ON');
 this.activate();
 }

 changeFechaDesde() {
	 setTimeout(() => {
		this.fechadesdeMin = angular.copy(this.fechaDesde);
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
			 
	 });
}


 exportarCierresExcel(){
	 this.cierreRecepcionDataService.exportarCierresExcel(this.filtroDto).then((resul) =>{
		 
	 })
 }

 setStoredData() {
	var cierreRecepcionStorageData = {
		fechaDesde: angular.copy(this.fechaDesde), // ✔
		fechaHasta: angular.copy(this.fechaHasta), // ✔
		sucursalSeleccionada: angular.copy(this.sucursalElegida), // ✔
		servicioSeleccionado: angular.copy(this.servicioMedicoElegido), // ✔
		numeroCierre: angular.copy(this.numeroCierre), // ✔
		usuarioSeleccionado: angular.copy(this.usuarioElegido)// ✔
	}
	this.StorageService.setStorageObj(this.storageKeys.keyCierreRecepcion, cierreRecepcionStorageData);
}

getStoredData(){
	if (this.StorageService.existStoredObjects(this.storageKeys.keyCierreRecepcion)){
		var stored =  this.StorageService.getStorageObj(this.storageKeys.keyCierreRecepcion);
		this.fechaDesde =  angular.copy(stored.fechaDesde) ;
		this.fechaHasta =  angular.copy(stored.fechaHasta) ;
		this.sucursalElegida =  angular.copy(stored.sucursalSeleccionada);
		this.servicioMedicoElegido  =  angular.copy(stored.servicioSeleccionado);
		this.numeroCierre =  angular.copy(stored.numeroCierre);
		this.usuarioActual  =  angular.copy(stored.usuarioSeleccionado);
	}	
	this.cleanStorage();

}


cleanStorage() {
	this.StorageService.cleanStorage(this.storageKeys.keyCierreRecepcion);
}

 limpiarFiltros() {
	/*Para limpiar los Filtros de Busqueda */
	this.sucursalElegida = {};
	this.servicioMedicoElegido = {};
	delete this.fechaDesde;
	delete this.fechaHasta;
	setTimeout(() => {
		this.fechaDesde = new Date();	
		this.fechaHasta = new Date();
	});
	
	
	this.numeroCierre = 0;
	this.busquedaUsuario = '';
	this.cambioSucursal(); 
	this.buscar();
	
}

buscar() {
	if (!this.currentPage) this.currentPage = 1;
	this.buscarPagina({ currentPage: this.currentPage });
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


imprimirCierre(row: any, index: number){
	this.cierreRecepcionDataService.obtenerPorId(row.Id).then((resultado) =>{
		this.cierreRecepcionDetalle = resultado;
		this.ICierreRecepcionLogicService.imprimirCierreRecepcion(this.cierreRecepcionDetalle).then((result) => {

		})

	});
}

cambioServicioMedico(){
};

volver() {
	this.$state.go('homesistemas');
}


guardarFiltroDeBusqueda(){
	this.setStoredData();
}

buscarFiltroGuardado(){
	this.getStoredData();
}


buscarPagina(pPaginacion){
	
	console.log("this.busquedaUsuario ",this.busquedaUsuario);

	this.currentPage = pPaginacion.currentPage;
	var pageSize = pPaginacion.pageSize || 10;

	this.filtroDto.IdUsuario = this.busquedaUsuario && this.busquedaUsuario.Id? this.busquedaUsuario.Id : this.usuarioActual.Id; //0 // poner usuario actual
	this.filtroDto.IdSucursal = this.sucursalElegida && this.sucursalElegida.Id? this.sucursalElegida.Id : 0;
	this.filtroDto.NroCierreLegacy = this.numeroCierre && this.numeroCierre? this.numeroCierre : 0;
	this.filtroDto.IdServicio =  this.servicioMedicoElegido && this.servicioMedicoElegido.Id? this.servicioMedicoElegido.Id : 0;
	this.filtroDto.FechaDesde = this.DateUtils.parseToBeParams(this.fechaDesde)? this.DateUtils.parseToBeParams(this.fechaDesde) :  this.DateUtils.parseToBeParams(new Date());
	this.filtroDto.FechaHasta = this.DateUtils.parseToBeParams(this.fechaHasta)? this.DateUtils.parseToBeParams(this.fechaHasta) :  this.DateUtils.parseToBeParams(new Date());
	this.filtroDto.CurrentPage = this.currentPage;
	this.filtroDto.PageSize = pageSize;

	this.cierreRecepcionDataService.obtenerPorFiltro(this.filtroDto).then((resultado) => {
		this.cierreRecepcion = resultado
	});
}
 

generarNuevoCierre(){
 this.ICierreRecepcionLogicService.generarNuevoCierreRecepcion(this.jerarquia, this.busquedaUsuario).then((resultado) => {
	//if (resultado === true){
		this.buscar();
	//}

 });
}



verCierreRecepcion(row: any, index: number){
	this.guardarFiltroDeBusqueda();
	this.$state.go('facturacion.cierreRecepcionList.edit',{
		IdCierreRecepcion: row.Id,
		NroCierreLegacy: row.NroCierreLegacy
	});
}

	eliminar(fila: any, index: number) {
		this.ModalService.confirm('¿Desea eliminar el cierre Nro° '+ fila.NroCierreLegacy +'?', (pResult) => {
			if (pResult) {
				this.cierreRecepcionDataService.eliminarCierreRecepcion(fila.Id).then((result) => {
					if (result.IsOk === false) {
						this.AlertaService.NewWarning("Por favor verifique:" + result.Message);
					}
					else {
						 if (this.cierreRecepcion.Rows) {
						 	for (let i = 0; i < this.cierreRecepcion.Rows.length; i++) {
						 		if (this.cierreRecepcion.Rows[i].Id === fila.Id) {
						 			this.cierreRecepcion.Rows ? this.cierreRecepcion.Rows.splice(i, 1) : null;
						 			this.AlertaService.NewSuccess("La lista ha sido eliminada.");
						 			break;
						 		}
						 	}
						 }
					}
				})
					.catch((pError) => {
						this.AlertaService.NewError("Error en el servidor.", pError.message);
						return;
					});
			}
		});

	}


	obtenerJerarquia(usuario){
		this.loading = true;
		this.UsuarioGestionDataService.ObtenerUsuarioConColaboradores(usuario.Id) // 465 para pruebas (Edgardo de La Mata)
			.then( (pResult) => {
	
				// seteo los colaboradores si es que tiene
				if(pResult && pResult.length){
					pResult.forEach(colaborador => {
						this.jerarquia.push({
							Nombre: colaborador.Id + " - " + colaborador.Nombre,
							Id: colaborador.Id
						});
					});
				}
				
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}

activate(){
	this.today = new Date();
	delete this.fechaDesde;
	delete this.fechaHasta;
	setTimeout(() => {
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
	
		this.fechadesdeMin = angular.copy(this.fechaDesde);
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
			
	});

	let usuarioActual = this.CredentialsDataService.GetForce();
	this.usuarioElegido.Id     = usuarioActual.id
	this.usuarioElegido.Nombre = usuarioActual.name

	// this.jerarquia.push({
	// 	Nombre: usuarioActual.id + " - " + usuarioActual.name,
	// 	Id: usuarioActual.id
	// });

	this.usuarioActual =this.usuarioElegido //this.jerarquia[0];

	this.obtenerJerarquia(this.usuarioActual);

	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales
		this.cambioSucursal(); 
		this.buscarFiltroGuardado();
		this.buscar();
	});
}



}

