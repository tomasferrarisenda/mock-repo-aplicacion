/**
* @author: rbassi
* @description: definitivos para el financiador Controller
* @type: Controller
**/
import * as angular from 'angular';
import {IDefinitivosDataService} from '../../services/definitivosDataService'
import {IDefinitivosLogicService} from '../../services/definitivosLogicService'
import {filtroDefinitivoDTO} from '../../models/filtroDefinitivoDTO'
import { ISucursalDataService } from '../../../../support/basic/services/SucursalDataService'
import { IGruposPracticasCierresDataService } from '../../../configuraciones/gruposPracticasCierres/services/gruposPracticasCierresDataService'
import { IRecepcionTurnosStorageHelperService } from '../../../../recepcionTurnos/services/RecepcionTurnosStorageHelperService';
import { IloteDataService } from '../../../lote/services/loteDataService'
import { IloteLogicService } from '../../../lote/services/loteLogicService'

export class definitivosListController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Definitivos para el financiador', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 today: Date = new Date();

 currentPage = 0;
 filtroDto : filtroDefinitivoDTO = {};
 fechaDesde: any;
 fechaHasta: any;
 fechaHoy: any;
 fechaDesdeMin: any;
 sucursalLista: IEntidadDto[] = [];
 sucursalElegida: IEntidadDto = {};
 servicioLista: IEntidadDto[] = [];
 servicioMedicoElegido: IEntidadDto = {}
 usuarioElegido: IEntidadDto= {};
 usuarioActual: string = "";
 definitivosLista: any;
 ambitoLista: IEntidadDto[] = [];
 ambitoElegida: IEntidadDto = {};
 numeroDefinitivo: number = 0;
 mutualElegida: any;
 tipoFiltroFecha: number = 1;
 seleccionarTodos: boolean = false;
 loading: boolean = false;
 jerarquia: any[] = [];
 tipoFechaDefinitivoLista: IEntidadDto[] = [];
 tipoFechaDefinitivoElegido: IEntidadDto = {};
 numeroLote: number = 0;
 storageKeys = {
	keyDefinitivo: "definitivo-list"
}


  // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','$state','DefinitivosDataService','DateUtils','SucursalDataService','GruposPracticasCierresDataService',
									'DefinitivosLogicService','ModalService','AlertaService', 'UsuarioGestionDataService','RecepcionTurnosStorageHelperService',
									'loteDataService','loteLogicService'];
 /**
 * @class definitivosListController
 * @constructor
 */
 constructor(private $log: ILogger,
			 private $state,
			 private definitivoDataService: IDefinitivosDataService,
			 private DateUtils: IDateUtils,
			 private SucursalDataService: ISucursalDataService,
			 private GruposPracticasCierresDataService : IGruposPracticasCierresDataService,
			 private definitivoLogicService: IDefinitivosLogicService,
			 private ModalService:IModalService,
			 private AlertaService: IAlertaService,
			 private UsuarioGestionDataService,
			 private StorageService: IRecepcionTurnosStorageHelperService,
			 private loteDataService : IloteDataService,
			 private loteLogicService: IloteLogicService,
			){				
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class definitivosListController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('definitivosListController');
 this.$log.debug('ON');

 this.obtenerFiltroDTO();

 this.activate();	

 }


 setStoredData() {
	var definitivoListStorageData = {
		fechaDesde: angular.copy(this.fechaDesde), // ✔
		fechaHasta: angular.copy(this.fechaHasta), // ✔
		numeroDefinitivo: angular.copy(this.numeroDefinitivo), // ✔
		sucursalSeleccionada: angular.copy(this.sucursalElegida), // ✔
		servicioSeleccionado: angular.copy(this.servicioMedicoElegido), // ✔
		ambitoSeleccionado: angular.copy(this.ambitoElegida), // ✔
		mutualElegida: angular.copy(this.mutualElegida), // ✔
		numeroLote: angular.copy(this.numeroLote) // ✔
	}
	this.StorageService.setStorageObj(this.storageKeys.keyDefinitivo, definitivoListStorageData);
}

getStoredData(){
	if (this.StorageService.existStoredObjects(this.storageKeys.keyDefinitivo)){
		var stored =  this.StorageService.getStorageObj(this.storageKeys.keyDefinitivo);
		this.fechaDesde =  angular.copy(stored.fechaDesde) ;
		this.fechaHasta =  angular.copy(stored.fechaHasta) ;
		this.numeroDefinitivo =  angular.copy(stored.numeroDefinitivo);
		this.sucursalElegida =  angular.copy(stored.sucursalSeleccionada);
		this.servicioMedicoElegido  =  angular.copy(stored.servicioSeleccionado);
		this.ambitoElegida =  angular.copy(stored.ambitoSeleccionado);
		this.mutualElegida  =  angular.copy(stored.mutualElegida);
		this.numeroLote = angular.copy(stored.numeroLote);
	}	
	this.cleanStorage();

}

cleanStorage() {
	this.StorageService.cleanStorage(this.storageKeys.keyDefinitivo);
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
buscar() {
	if (!this.currentPage) this.currentPage = 1;
	this.buscarPagina({ currentPage: this.currentPage });
}

volver() {
	this.$state.go('homesistemas');
}

buscarPagina(pPaginacion) {
	
	this.currentPage = pPaginacion.currentPage;
	var pageSize = pPaginacion.pageSize || 1000;

	this.filtroDto.FechaDesde = this.DateUtils.parseToBeParams(this.fechaDesde)? this.DateUtils.parseToBeParams(this.fechaDesde) :  this.DateUtils.parseToBeParams(new Date())
	this.filtroDto.FechaHasta = this.DateUtils.parseToBeParams(this.fechaHasta)? this.DateUtils.parseToBeParams(this.fechaHasta) :  this.DateUtils.parseToBeParams(new Date())
	this.filtroDto.IdAmbito = this.ambitoElegida && this.ambitoElegida.Id ? this.ambitoElegida.Id : 0;
	this.filtroDto.IdMutual = this.mutualElegida && this.mutualElegida.Id ? this.mutualElegida.Id : 0;
	this.filtroDto.IdServicio = this.servicioMedicoElegido && this.servicioMedicoElegido.Id ? this.servicioMedicoElegido.Id : 0;
	this.filtroDto.IdSucursal = this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0;
	this.filtroDto.IdTipoAfiliado = 0
	this.filtroDto.IdTipoFiltroFechaDefinitivo = this.tipoFechaDefinitivoElegido && this.tipoFechaDefinitivoElegido.Id ? this.tipoFechaDefinitivoElegido.Id : 0;
	this.filtroDto.NroDefinitivo = this.numeroDefinitivo ? this.numeroDefinitivo : 0;
	this.filtroDto.NroLote = this.numeroLote ? this.numeroLote : 0;
	this.filtroDto.PageSize = pageSize;
	this.filtroDto.CurrentPage = this.currentPage;
	
	this.definitivoDataService.obtenerDefinitivosPorFiltro(this.filtroDto).then((definitivos)=>{
		this.definitivosLista = definitivos
		console.log("this.definitivosLista ",this.definitivosLista)
	}) 

}


imprimirLote(lote: number){

	if (lote){
		this.loteDataService.obtenerLotePorNumeroDeLote(lote).then((loteImprmir) => {
			this.loteLogicService.imprimirReporteLote(loteImprmir).then((result)=>{
			})
		})
	 }
}


editarDefinitivo(row: any){
	this.guardarFiltroDeBusqueda()
	this.$state.go('facturacion.definitivosList.edit',{
		IdDefinitivo: row.Id,
		NombreUsuario : this.usuarioElegido.Nombre
	});
}

imprimir(row: any){
	this.definitivoDataService.imprimirDefinitivo(row.Id).then((resultadoImprimir) => {
		this.definitivoLogicService.imprimirReporteDefinitivo(resultadoImprimir).then((result) => {
		})
		this.buscar();
	})
}

Anular(row: any) {
	this.ModalService.confirm('¿Desea anular el definitivo Nro° '+ row.NroDefinitivoLegacy +'?', (pResult) => {
		if (pResult) {
			this.definitivoDataService.anularDefinitivo(row.Id).then((result) => {
				if (result.IsOk === false) {
					this.AlertaService.NewWarning("Por favor verifique:" + result.Message);
				}
				else {
					this.buscar();
				}
			})
				.catch((pError) => {
					this.AlertaService.NewError("Error en el servidor.", pError.message);
					return;
				});
		}
	});
}

seleccionarTodosChange(data) {

	data.forEach(definitivo => {
		if (definitivo.NombreEstado === "Confeccionado"){
			definitivo.Seleccionado = this.seleccionarTodos;
		} 
	});

}

exportarDefinitivosExcel(){
	this.definitivoDataService.exportarListaDefinitivoExcel(this.filtroDto).then((resultado)=>{

	})
}

exportarItemsDefinitivoExcel(idDefinitivo){
	this.definitivoDataService.exportarItemsDefinitivoExcel(idDefinitivo).then((resul)=>{

	})

}
deseleccionarTodos(data){

	data.forEach(definitivo => {
		definitivo.Seleccionado = false;
	});
	
}

seleccionarDefinitivo(){
	if(!this.definitivosLista.Rows.find(x => x.Seleccionado)) this.seleccionarTodos = false;
}

tieneSeleccionado() {
	let ret = true;
	if (this.definitivosLista && this.definitivosLista.Rows) {
		if (this.definitivosLista.Rows.find(x => x.Seleccionado)) ret = false;
	}
	return ret;
}


obtenerFiltroDTO(){
	this.definitivoDataService.crearFiltroBusqueda().then((resultado) => {
	 })
 }

obtenerAmbitos(){
	this.definitivoDataService.ambitosObtenerTodos().then((ambitos) =>{
		this.ambitoLista = ambitos;
	})
}


cambioFiltroFecha(){
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

generarNuevoDefinitivo(){
	this.definitivoLogicService.obtenerCierresParaGenerarDefinitivos().then((resultado) =>{
		this.buscar()
	})
}


generarLote(){

	this.ModalService.confirm('¿Generar lote de los definitivos seleccionados?', (pResult) => {
		if (pResult) {
			let listaAEnviar = {
				Lista: this.definitivosLista.Rows
			}
		
			this.definitivoDataService.generarLoteDeDefinitivos(listaAEnviar).then((result) => {
				if (result && result.NroLoteLegacy) {
					this.AlertaService.NewSuccess("Se ha generó el Lote Nro: " + result.NroLoteLegacy);
		
					this.deseleccionarTodos(this.definitivosLista.Rows);
					this.buscar();
		
				}
				else {
					this.AlertaService.NewWarning("No hay registros para procesar");
				}
			})	
		}
	});
}


limpiarFiltros() {
	/*Para limpiar los Filtros de Busqueda */
	this.mutualElegida = {};
	this.sucursalElegida = {};
	this.servicioMedicoElegido = {};
	delete this.fechaDesde;
	delete this.fechaHasta;
	setTimeout(() => {
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
	});
	this.ambitoElegida = {};
	this.numeroDefinitivo = 0;
	this.numeroLote = 0;
	this.cambioSucursal(); 
	this.buscar();
}

obtenerJerarquia(usuario){

	this.loading = true;
	
	this.UsuarioGestionDataService.obtenerParaMostrarJerarquiaDeUsuarios(usuario.Id)
		.then( (pResult) => {
			// seteo los colaboradores si es que tiene
			if(pResult.Colaboradores && pResult.Colaboradores.length){
				pResult.Colaboradores.forEach(colaborador => {
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

imprimirDefinitivosSeleccionados(data){
	let idsDefinitivos: IidsDefinitivosImprimir = {
		Ids:[]
	}

	data.forEach(definitivo => {
		if (definitivo.Seleccionado === true) {
			idsDefinitivos.Ids.push(definitivo.Id)
		} 
	});

	this.definitivoLogicService.imprimirDefinitivosSeleccion(idsDefinitivos).then((resultado) =>{

	})
}


imprimirLotesSeleccionados(data){
	let idLoteAnterior 
	let idsLotes: IidsLotesImprimir = {
		Ids:[]
	}
	data.forEach(definitivo => {
		if (definitivo.Seleccionado === true) {
			 if (idLoteAnterior != definitivo.IdLote) {
			 	idsLotes.Ids.push(definitivo.IdLote)
			 	idLoteAnterior = definitivo.IdLote
			 }

			// idsLotes.Ids.push(1)
			// idsLotes.Ids.push(2)
			// idsLotes.Ids.push(3)
			// idsLotes.Ids.push(4)


		} 
	});
	console.log("idsLotes ",idsLotes)
	this.definitivoLogicService.imprimirLotesSeleccion(idsLotes).then((resultado) =>{

	})
}


activate(){
	this.fechaDesde = this.today;
	this.fechaHasta = this.today;
	this.fechaDesdeMin = angular.copy(this.fechaDesde);
	this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);

	this.tipoFechaDefinitivoLista.push({
		Id : 1,
		Nombre : "Por Fecha de Definitivo"
	})
	this.tipoFechaDefinitivoLista.push({
		Id : 2,
		Nombre : "Por Fecha de Recepción"
	})

	this.tipoFechaDefinitivoElegido = this.tipoFechaDefinitivoLista[0];

	this.obtenerAmbitos();

	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales
		this.cambioSucursal(); 
		this.buscarFiltroGuardado();		
		this.buscar();
	});
}


 // #endregion
}

interface IidsDefinitivosImprimir {
	Ids : number[];
}

interface IidsLotesImprimir {
	Ids : number[];
}
