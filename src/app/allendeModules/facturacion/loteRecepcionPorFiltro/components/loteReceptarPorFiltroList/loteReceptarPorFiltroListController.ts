/**
* @author: rbassi
* @description: receptar lote por filtro controller
* @type: Controller
**/
import * as angular from 'angular';
import { IloteReceptarPorFiltroDataService, loteReceptarPorFiltroDataService } from '../../services/loteReceptarPorFiltroDataService'
import { filtroLoteDTO } from '../../models';
import { ISucursalDataService } from '../../../../support/basic/services/SucursalDataService'
import { ICredentialsDataService } from 'core/security';
import { IGruposPracticasCierresDataService } from '../../../configuraciones/gruposPracticasCierres/services/gruposPracticasCierresDataService'
import { IloteLogicService, IloteDataService } from '../../../lote/services'
import { AnyTxtRecord } from 'dns';
import { IRecepcionTurnosStorageHelperService } from 'src/app/allendeModules/recepcionTurnos';
export class loteReceptarPorFiltroListController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Recepcion de Lotes por filtro', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..

 today: Date = new Date();

 filtroDTO: filtroLoteDTO = {};
 fechaDesde: any;
 fechaHasta: any;
 fechaHoy: any;
 fechaDesdeMin: any;
 sucursalLista: IEntidadDto[] = [];
 sucursalElegida: IEntidadDto = {};
 servicioLista: IEntidadDto[] = [];
 servicioMedicoElegido: IEntidadDto = {}
 currentPage = 0
 usuarioElegido: IEntidadDto= {};
 usuarioActual: IEntidadDto= {};
 jerarquia: any[] = [];
 numeroLoteLegacy: number = 0;
 lotesRecepcionLista: any;
 estadoLoteElegido: IEntidadDto = {};
 estadoLoteLista: IEntidadDto[] = [];
 seleccionarTodos: boolean = false;
 idsReceptar:IidsReceptar[]=[];
 storageKeys = {
	keyLoteRecepcionFiltro : "lote-recepcion-filtro"
 }
 busquedaUsuario: any;
 busquedaUsuarioElegido: IEntidadDto= {};
 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','loteReceptarPorFiltroDataService','DateUtils',
 'SucursalDataService','AlertaService','$state','CredentialsDataService', 'UsuarioGestionDataService',
 'GruposPracticasCierresDataService','loteLogicService','loteDataService','ModalService','RecepcionTurnosStorageHelperService'];
 /**
 * @class loteReceptarPorFiltroListController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	 private loteReceptarPorFiltroDataService: IloteReceptarPorFiltroDataService,
	 private DateUtils: IDateUtils,
	 private SucursalDataService: ISucursalDataService,
	 private AlertaService: IAlertaService,
	 private $state,
	 private CredentialsDataService: ICredentialsDataService,
	 private UsuarioGestionDataService,
	 private GruposPracticasCierresDataService : IGruposPracticasCierresDataService,
	 private loteLogicService: IloteLogicService,
	 private loteDataService: IloteDataService,
	 private ModalService : IModalService,
	 private StorageService: IRecepcionTurnosStorageHelperService,
	){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class loteReceptarPorFiltroListController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('loteReceptarPorFiltroListController');
 this.$log.debug('ON');
 this.activate();

 }

 setStoredData() {
	var loteRecepcionStorageData = {
		desdeFecha: angular.copy(this.fechaDesde), // ✔
		hastaFecha: angular.copy(this.fechaHasta), // ✔
		sucursal: angular.copy(this.sucursalElegida), // ✔
		servicio: angular.copy(this.servicioMedicoElegido), // ✔
		usuario: angular.copy(this.usuarioElegido), // ✔
		estadoLote: angular.copy(this.estadoLoteElegido), // ✔
		numeroLote: angular.copy(this.numeroLoteLegacy), // ✔
	}
	this.StorageService.setStorageObj(this.storageKeys.keyLoteRecepcionFiltro, loteRecepcionStorageData);
}

getStoredData(){
	if (this.StorageService.existStoredObjects(this.storageKeys.keyLoteRecepcionFiltro)){
		var stored =  this.StorageService.getStorageObj(this.storageKeys.keyLoteRecepcionFiltro);
		this.fechaDesde =  angular.copy(stored.desdeFecha) ;
		this.fechaHasta =angular.copy(stored.hastaFecha) ;
		this.sucursalElegida = angular.copy(stored.sucursal) ;
		this.servicioMedicoElegido = angular.copy(stored.servicio) ;
		this.usuarioElegido = angular.copy(stored.usuario) ;
		this.estadoLoteElegido = angular.copy(stored.estadoLote) ;
		this.numeroLoteLegacy = angular.copy(stored.numeroLote) ;
	}	
	this.cleanStorage();
}

cleanStorage() {
	this.StorageService.cleanStorage(this.storageKeys.keyLoteRecepcionFiltro);
}


guardarFiltroDeBusqueda(){
	this.setStoredData();
}

buscarFiltroGuardado(){
	this.getStoredData();
}


changeFechaDesde(){
	setTimeout(() => {
		this.fechaDesdeMin = angular.copy(this.fechaDesde);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1)
	});
}

 esVisibleSegunEstado(row: any, idEstado: number){
	return (row.IdEstadoLote !== idEstado)
}


tieneSeleccionado() {
	let ret = true;
	if (this.lotesRecepcionLista && this.lotesRecepcionLista.Rows) {
		if (this.lotesRecepcionLista.Rows.find(x => x.Seleccionado)) ret = false;
	}
	return ret;
}

exportarLoteExcel(){
	this.loteDataService.exportarListaLoteExcel(this.filtroDTO).then((result) =>{
		
	})
}


 obtenerJerarquia(usuario){
	this.jerarquia = [];

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
			
	}, (pError) => {
		this.$log.error('pError',pError);
	});
}

cambioSucursal(){
	//this.$log.debug('sucursalElegida', this.sucursalElegida);
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


limpiarFiltros(){
 this.sucursalElegida = {};
 this.servicioMedicoElegido = {};
 this.usuarioElegido = {};
 this.numeroLoteLegacy = 0;
 this.estadoLoteElegido= {};
 this.busquedaUsuario ="";

 delete this.fechaDesde;
 delete this.fechaHasta;

 setTimeout(() => {
	 this.fechaDesde = new Date();
	 this.fechaHasta = new Date();
	 this.fechaDesdeMin = angular.copy(this.fechaDesde);
	 this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1)
 });

this.buscar();

}


buscar() {
	if (!this.currentPage) this.currentPage = 1;
	this.buscarPagina({ currentPage: this.currentPage });
}

buscarPagina(pPaginacion){

	let idusuario = this.busquedaUsuario && this.busquedaUsuario.Id? this.busquedaUsuario.Id : this.usuarioActual && this.usuarioActual.Id ? this.usuarioActual.Id : 0;


	 this.currentPage = pPaginacion.currentPage;
	 var pageSize = 1000 //pPaginacion.pageSize || 10;

	 this.filtroDTO.CurrentPage = this.currentPage;
	 this.filtroDTO.PageSize = pageSize;
	 this.filtroDTO.FechaDesde = this.DateUtils.parseToBeParams(this.fechaDesde)? this.DateUtils.parseToBeParams(this.fechaDesde) :  this.DateUtils.parseToBeParams(new Date());
	 this.filtroDTO.FechaHasta = this.DateUtils.parseToBeParams(this.fechaHasta)? this.DateUtils.parseToBeParams(this.fechaHasta) :  this.DateUtils.parseToBeParams(new Date());
	 this.filtroDTO.IdServicio = this.servicioMedicoElegido && this.servicioMedicoElegido.Id ? this.servicioMedicoElegido.Id : 0;
	 this.filtroDTO.IdSucursal = this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0;
	 this.filtroDTO.IdEstado   = this.estadoLoteElegido && this.estadoLoteElegido.Id ? this.estadoLoteElegido.Id : 0;
	 this.filtroDTO.IdUsuario  = idusuario // this.usuarioActual && this.usuarioActual.Id ? this.usuarioActual.Id : 0;
	 this.filtroDTO.NroLoteLegacy  = this.numeroLoteLegacy ? this.numeroLoteLegacy : 0;
	//	console.log("this.filtroDTO ",this.filtroDTO)
	this.loteReceptarPorFiltroDataService.obtenerLotesPorFiltro(this.filtroDTO).then((result) => {
		this.lotesRecepcionLista = result;
		console.log("this.lotesRecepcionLista ",this.lotesRecepcionLista )
	})


 }


 imprimirLote(lote: any){

	if (lote.NroLoteLegacy){
		this.loteDataService.obtenerLotePorNumeroDeLote(lote.NroLoteLegacy).then((loteImprmir) => {
			this.loteLogicService.imprimirReporteLote(loteImprmir).then((result)=>{
			})
		})
	 }
}



receptarLote(lote: any){

	this.ModalService.confirm('¿Desea Receptar el Lote Nro: '+ lote.NroLoteLegacy +'?', (pResult) => {
		if (pResult){

			this.loteDataService.obtenerLotePorNumeroDeLote(lote.NroLoteLegacy).then((loteLista) => {

				this.loteDataService.receptarLote(loteLista).then((result) => {
					if (result.IsOk === true) {
						this.AlertaService.NewSuccess("Lote Receptado Correctamente");
						this.buscar(); 
					}
					else {
						this.AlertaService.NewWarning(result.Message);
					}
				})
			})
		}
	});
}

rechazarLote(lote: any){

	this.ModalService.confirm('¿Está a punto de RECHAZAR el Lote Nro: '+ lote.NroLoteLegacy +', desea continuar?', (pResult) => {
		if (pResult){

			this.loteDataService.obtenerLotePorNumeroDeLote(lote.NroLoteLegacy).then((loteLista) => {

				this.loteDataService.rechazarLote(loteLista).then((result) => {
					if (result.IsOk === true) {
						this.AlertaService.NewSuccess("Lote Rechazado Correctamente");
						this.buscar(); 
					}
					else {
						this.AlertaService.NewWarning(result.Message);
					}
				})
			})
		}
	});
}

rechazarLotePorId(lote: any){
	this.ModalService.confirm('¿Está a punto de RECHAZAR el Lote Nro: '+ lote.NroLoteLegacy +', desea continuar?', (pResult) => {
		if (pResult){
				this.loteDataService.rechazarLotePorId(lote.Id).then((result) => {
					if (result.IsOk === true) {
						this.AlertaService.NewSuccess("Lote Rechazado Correctamente");
						this.buscar(); 
					}
					else {
						this.AlertaService.NewWarning(result.Message);
					}
				})
		}
	});
}

receptarLotePorId(lote: any){
	
	this.ModalService.confirm('¿Desea Receptar el Lote Nro: '+ lote.NroLoteLegacy +'?', (pResult) => {
		if (pResult){
				this.loteDataService.receptarLotePorId(lote.Id).then((result) => {
					if (result.IsOk === true) {
						this.AlertaService.NewSuccess("Lote Receptado Correctamente");
						this.buscar(); 
					}
					else {
						this.AlertaService.NewWarning(result.Message);
					}
				})
		}
	});
}


editarDefinitivo(lote: any){
	this.guardarFiltroDeBusqueda();
	this.$state.go('facturacion.lotesListView.Edit',{
		lote: lote
	});
}


seleccionarTodosChange(data) {

	data.forEach(lote => {
		if (lote.IdEstadoLote === 1 ){
			lote.Seleccionado = this.seleccionarTodos;
		}
	});

}

recepcionarSeleccionados(data){

	let idsReceptar: IidsReceptar = {
		Ids:[]
	}

	 data.forEach(lote => {
	 	if (lote.Seleccionado === true ){
			
			idsReceptar.Ids.push(lote.Id);
		}
	 });


	 this.loteReceptarPorFiltroDataService.receptarLotesPorIds(idsReceptar).then((result) => {

	 	if (result.IsOk === true) {
	 		this.AlertaService.NewSuccess("Lotes Receptados Correctamente");
	 		this.buscar(); 
	 	}
	 	else {
	 		this.AlertaService.NewWarning(result.Message);
	 	}
	 })

}

deseleccionarTodos(data){

	data.forEach(lote => {
		lote.Seleccionado = false;
	});
	
}

seleccionarDefinitivo(){
	if(!this.lotesRecepcionLista.Rows.find(x => x.Seleccionado)) this.seleccionarTodos = false;
}

volver() {
	this.$state.go('homesistemas');
 }

activate(){

	delete this.fechaDesde;
	delete this.fechaHasta;

	setTimeout(() => {
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
		this.fechaDesdeMin = angular.copy(this.fechaDesde);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1)
	});
	
	let usuarioActual = this.CredentialsDataService.GetForce();
	this.usuarioElegido.Id     = usuarioActual.id
	this.usuarioElegido.Nombre = usuarioActual.name
	
	this.usuarioActual =this.usuarioElegido //this.jerarquia[0];


	this.obtenerJerarquia(this.usuarioActual);

	 this.loteReceptarPorFiltroDataService.obtenerEstadosLote().then((resultado) => 	{
	 	this.estadoLoteLista = resultado;
	 })

	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales
		this.cambioSucursal(); 
		this.buscarFiltroGuardado();
		this.buscar(); 
	});
}


 // #endregion
}

interface IidsReceptar {
	Ids : number[];
}