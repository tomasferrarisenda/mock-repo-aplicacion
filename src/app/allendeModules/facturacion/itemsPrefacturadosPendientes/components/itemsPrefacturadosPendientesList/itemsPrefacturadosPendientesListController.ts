/**
* @author: rbassi
* @description: controller de items prefacturados pendientes
* @type: Controller
**/
import * as angular from 'angular';
import { IitemsPrefacturadosPendientesDataService } from '../../services/itemsPrefacturadosPendientesDataService'
import { filtroItemsPrefacturadosPendientesDTO } from '../../models/filtroItemsPrefacturadosPendientesDTO';
import { ISucursalDataService } from '../../../../support/basic/services/SucursalDataService'
import { IGruposPracticasCierresDataService } from '../../../configuraciones/gruposPracticasCierres/services/gruposPracticasCierresDataService'
import { ICredentialsDataService } from 'core/security';
import { ICierreRecepcionLogicService } from '../../../cierreRecepcion/services/cierreRecepcionLogicService'
import { IRecepcionTurnosStorageHelperService } from '../../../../recepcionTurnos/services/RecepcionTurnosStorageHelperService';
export class itemsPrefacturadosPendientesListController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Items prefacturados pendientes', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };

 // mas propiedades ..

today: Date = new Date();

fechaDesde: any;
fechaHasta: any;
fechaHoy:any;
fechaDesdeMin: any;
sucursalLista: IEntidadDto[] = [];
sucursalElegida: IEntidadDto = {};
servicioLista: IEntidadDto[] = [];
servicioMedicoElegido: IEntidadDto = {}
itemsPendientes: any;
currentPage = 0
filtroDTO : filtroItemsPrefacturadosPendientesDTO = {};
usuarioElegido: IEntidadDto= {};
usuarioActual: IEntidadDto= {};
jerarquia: any[] = [];
estadoLista: IEntidadDto[] = [];
estadoElegido: IEntidadDto = {};
busquedaUsuario: any;
textoBotonCierre: string = '';
tildeDefinitivo: boolean = false;

storageKeys = {
	keyItemsPendientes: "items-prefacturados-pendientes-list"
}
 // #endregion
 
 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','itemsPrefacturadosPendientesDataService','DateUtils',
 'SucursalDataService','GruposPracticasCierresDataService','AlertaService','$state','CredentialsDataService', 
 'UsuarioGestionDataService','CierreRecepcionLogicService','RecepcionTurnosStorageHelperService','ORIGEN_PREFACTURA'];
 /**
 * @class itemsPrefacturadosPendientesListController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	 private itemsPrefacturadosPendientesDataService :IitemsPrefacturadosPendientesDataService,
	 private DateUtils: IDateUtils,
	 private SucursalDataService: ISucursalDataService,
	 private GruposPracticasCierresDataService : IGruposPracticasCierresDataService,
	 private AlertaService: IAlertaService,
	 private $state,
	 private CredentialsDataService: ICredentialsDataService,
	 private UsuarioGestionDataService,
	 private cierreRecepcionLogicService: ICierreRecepcionLogicService,
	 private StorageService: IRecepcionTurnosStorageHelperService,
	 private ORIGEN_PREFACTURA
	){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class itemsPrefacturadosPendientesListController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('itemsPrefacturadosPendientesListController');
 this.$log.debug('ON');
 this.activate();
 }


 
 setStoredData() {
	var itemsPendientesListStorageData = {
		fechaDesde: angular.copy(this.fechaDesde), // ✔
		fechaHasta: angular.copy(this.fechaHasta), // ✔
		sucursalSeleccionada: angular.copy(this.sucursalElegida), // ✔
		servicioSeleccionado: angular.copy(this.servicioMedicoElegido), // ✔
		estadoSeleccionado: angular.copy(this.estadoElegido), // ✔
		usuarioSeleccionado: angular.copy(this.usuarioElegido), // ✔
	}
	this.StorageService.setStorageObj(this.storageKeys.keyItemsPendientes, itemsPendientesListStorageData);
}

getStoredData(){
	if (this.StorageService.existStoredObjects(this.storageKeys.keyItemsPendientes)){
		var stored =  this.StorageService.getStorageObj(this.storageKeys.keyItemsPendientes);
		this.fechaDesde =  angular.copy(stored.fechaDesde) ;
		this.fechaHasta =  angular.copy(stored.fechaHasta) ;
		this.sucursalElegida =  angular.copy(stored.sucursalSeleccionada);
		this.servicioMedicoElegido  =  angular.copy(stored.servicioSeleccionado);
		this.estadoElegido =  angular.copy(stored.estadoSeleccionado);
		this.usuarioElegido =  angular.copy(stored.usuarioSeleccionado);
	}	
	this.cleanStorage();

}

cleanStorage() {
	this.StorageService.cleanStorage(this.storageKeys.keyItemsPendientes);
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
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);	
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

cambioEstado(){
}


exportarItemsPendientesExcel(){
	this.itemsPrefacturadosPendientesDataService.exportarItemsPendientesAExcel(this.filtroDTO).then((result) => {

	})
}


buscar() {
	if (!this.currentPage) this.currentPage = 1;
	this.buscarPagina({ currentPage: this.currentPage });
}

buscarPagina(pPaginacion){

	let idUsuario = this.busquedaUsuario && this.busquedaUsuario.Id? this.busquedaUsuario.Id : this.usuarioActual && this.usuarioActual.Id ? this.usuarioActual.Id : 0;

	this.currentPage = pPaginacion.currentPage;
	var pageSize = pPaginacion.pageSize || 10;

	this.filtroDTO.CurrentPage = this.currentPage;
	this.filtroDTO.PageSize = pageSize;
	this.filtroDTO.FechaDesde = this.DateUtils.parseToBeParams(this.fechaDesde)? this.DateUtils.parseToBeParams(this.fechaDesde) :  this.DateUtils.parseToBeParams(new Date());
	this.filtroDTO.FechaHasta = this.DateUtils.parseToBeParams(this.fechaHasta)? this.DateUtils.parseToBeParams(this.fechaHasta) :  this.DateUtils.parseToBeParams(new Date());
	this.filtroDTO.IdServicio = this.servicioMedicoElegido && this.servicioMedicoElegido.Id ? this.servicioMedicoElegido.Id : 0;
	this.filtroDTO.IdEstado   = this.estadoElegido && this.estadoElegido.Id ? this.estadoElegido.Id : 0;
	this.filtroDTO.IdUsuario  = idUsuario // this.usuarioActual && this.usuarioActual.Id ? this.usuarioActual.Id : 0;
	this.filtroDTO.IdSucursal = this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0;

	this.itemsPrefacturadosPendientesDataService.ObtenerItemsPendientesPorFiltros(this.filtroDTO).then((result) => {
			 this.itemsPendientes = result
			 console.log('Items Pendientes', this.itemsPendientes)
		 }) 

 }

 volver() {
	this.$state.go('homesistemas');
}

verHistoricoItem(row: any){
	this.cierreRecepcionLogicService.historialCambiosSobreItem(row.Id).then((result) => {
	})
}

generarCierre(){

	let idsPracticas: IidsItemsPendientesNormal = {
		Ids:[]
	}
	// guardo los Ids de las practicas que tienen estado NORMAL
	this.itemsPendientes.Rows.forEach(practica => {
		if (practica.IdEstado === 1){
			idsPracticas.Ids.push(practica.Id);
		}
	});
	console.log("idsPracticas ",idsPracticas)

	if (idsPracticas.Ids.length === 0){
		this.AlertaService.NewWarning("Debe existir al menos una practica con estado NORMAL para realizar cierre");

	}else {
		if (this.tildeDefinitivo){
			// llamo a la generacion de cierres Definitivo
			this.itemsPrefacturadosPendientesDataService.GenerarCierreItemsPendientes(idsPracticas).then((result) => {
				console.log("Resultado Genera Cierre ",result)

				if (result) {
					this.cierreRecepcionLogicService.imprimirCierreDirecto(result).then((resultadoModal) => {
					});
					this.buscar();
				}

			})
		} else
		{
			// llamo a la generacion de cierres para Control
			this.itemsPrefacturadosPendientesDataService.GenerarCierreItemsPendientesParaControl(idsPracticas).then((result) => {
				console.log("Resultado Genera Cierre ",result)

				this.cierreRecepcionLogicService.imprimirCierreRecepcionParaControl(result).then((resultModal)=>{

				})
				
			})
		}
	}
}

limpiarFiltros(){
	this.sucursalElegida = {};
	this.servicioMedicoElegido = {};
	this.estadoElegido = {};
	this.usuarioElegido= {};

	delete this.fechaDesde;
	delete this.fechaHasta;
	setTimeout(() => {
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
	
		this.fechaDesdeMin = angular.copy(this.fechaDesde);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);	
	});

	this.buscar();

}
editarItem(row: any, index: any){
	this.guardarFiltroDeBusqueda();

	this.$state.go('prefacturacion.ambulatorio.new', {
		esNuevo: false,
		id: row.IdOrigenPrefactura,
		idAmbito: this.ORIGEN_PREFACTURA.LISTADO_PREFACTURACION
	});
}

asignarMotivoFacturableNoFacturable(row: any, index: any, nombreEstado: string, idEstado: number){

	this.cierreRecepcionLogicService.editarDetalleItemEstadoCierres(row, this.usuarioElegido.Nombre ? this.usuarioElegido.Nombre : '' ,nombreEstado,idEstado,this.usuarioElegido && this.usuarioElegido.Id ? this.usuarioElegido.Id : 0).then((result) =>{
	//	 this.activate();
	this.buscarFiltroGuardado();
	this.buscar();

	});
};

esVisibleSegunEstado(row: any, idEstado: number){
	return (row.IdEstado !== idEstado && row.IdEstado !== 5)
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

cambioTildeDefinitivo(){
	this.textoBotonCierre = this.tildeDefinitivo? 'Cierre + Definitivo + Lote' : 'Generar Cierre Control';
}

 activate(){

	delete this.fechaDesde;
	delete this.fechaHasta;
	setTimeout(() => {
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
	
		this.fechaDesdeMin = angular.copy(this.fechaDesde);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);	
	});

	this.textoBotonCierre = this.tildeDefinitivo? 'Cierre + Definitivo + Lote' : 'Generar Cierre Control';

	this.itemsPrefacturadosPendientesDataService.ObtenerEstadosPendientesConEstadoNormal().then((listaDeEstados) => {
		this.estadoLista = listaDeEstados
	})

	let usuarioActual = this.CredentialsDataService.GetForce();
	this.usuarioElegido.Id     = usuarioActual.id
	this.usuarioElegido.Nombre = usuarioActual.name
	
	this.usuarioActual =this.usuarioElegido //this.jerarquia[0];


	this.obtenerJerarquia(this.usuarioActual);


	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales
		this.cambioSucursal(); 
		this.buscarFiltroGuardado();
		this.buscar(); 
	});
 }
 // #endregion

}


interface IidsItemsPendientesNormal {
	Ids : number[];
}

