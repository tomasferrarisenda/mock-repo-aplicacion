/**
* @author: rbassi
* @description: lote Receptar Controller
* @type: Controller
**/
import * as angular from 'angular';
import {IloteDataService} from '../../services/loteDataService'
import {IloteLogicService} from '../../services/loteLogicService'
import {IDefinitivosDataService} from '../../../definitivos/services/definitivosDataService'
import {IDefinitivosLogicService} from '../../../definitivos/services/definitivosLogicService'
import { ICredentialsDataService } from 'core/security';
import { IRecepcionTurnosStorageHelperService } from '../../../../recepcionTurnos/services/RecepcionTurnosStorageHelperService';


export class loteReceptarListController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Recepcion de lote', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 usuarioElegido: IEntidadDto= {};
 usuarioActual: string = "";
 loteLista: any;
 numeroLote: number = 0;
 storageKeys = {
	keyLoteRecepcion : "lote-recepcion"
 }
 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','$state','loteDataService','loteLogicService','CredentialsDataService','AlertaService',
 'DefinitivosDataService','DefinitivosLogicService','ModalService','RecepcionTurnosStorageHelperService'];
 /**
 * @class loteReceptarListController
 * @constructor
 */
 constructor(private $log: ILogger,
			 private $state,
			 private loteDataService: IloteDataService,
			 private loteLogicService: IloteLogicService,
	 		 private CredentialsDataService: ICredentialsDataService,
			 private AlertaService: IAlertaService,
			 private definitivoDataService : IDefinitivosDataService,
			 private definitivoLogicService : IDefinitivosLogicService,
			 private ModalService : IModalService,
			 private StorageService: IRecepcionTurnosStorageHelperService
){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class loteReceptarListController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('loteReceptarListController');
 this.$log.debug('ON');
 this.activate();

 }


 setStoredData() {
	var loteRecepcionStorageData = {
		numeroLote: angular.copy(this.numeroLote), // ✔
	}
	this.StorageService.setStorageObj(this.storageKeys.keyLoteRecepcion, loteRecepcionStorageData);
}

getStoredData(){
	if (this.StorageService.existStoredObjects(this.storageKeys.keyLoteRecepcion)){
		var stored =  this.StorageService.getStorageObj(this.storageKeys.keyLoteRecepcion);
		this.numeroLote =  angular.copy(stored.numeroLote) ;
	}	
	this.cleanStorage();
}

cleanStorage() {
	this.StorageService.cleanStorage(this.storageKeys.keyLoteRecepcion);
}

guardarFiltroDeBusqueda(){
	this.setStoredData();
}

buscarFiltroGuardado(){
	this.getStoredData();
}


 volver() {
	this.$state.go('homesistemas');
 }

 buscar(){
	 if (this.numeroLote){
		this.loteDataService.obtenerLotePorNumeroDeLote(this.numeroLote).then((result) => {
			this.loteLista = result

			if (!this.loteLista) {
				this.AlertaService.NewInfo("No existe el lote Nro: "+this.numeroLote+ ", ingrese otro por favor")
			}
		})
	 }
	 else{
		this.AlertaService.NewWarning("Debe ingresar un numero de Lote")
	 }
 }

 
 imprimirDefinitivo(row: any){
	this.definitivoDataService.imprimirDefinitivo(row.IdDefinitivo).then((resultadoImprimir) => {

		this.definitivoLogicService.imprimirReporteDefinitivo(resultadoImprimir).then((result) => {
		})

	})
}

editarDefinitivo(row: any){
	this.guardarFiltroDeBusqueda();

	this.$state.go('facturacion.definitivosList.edit',{
		IdDefinitivo: row.IdDefinitivo,
		NombreUsuario : this.usuarioElegido.Nombre
	});
}
 
tieneRegistros(){
	let ret = true;
	if (this.loteLista && this.loteLista.Items.Rows ) {
		ret = false;
	}
	return ret;


}
 
imprimirLote(lote: any){
	this.loteLogicService.imprimirReporteLote(lote).then((result)=>{
	})
}


receptarLote(){

	this.ModalService.confirm('¿Desea Receptar el Lote Nro: '+ this.numeroLote +'?', (pResult) => {
		if (pResult){

			this.loteDataService.receptarLote(this.loteLista).then((result) => {
				if (result.IsOk === true) {
					this.AlertaService.NewSuccess("Lote Receptado Correctamente");
				}
				else {
					this.AlertaService.NewWarning(result.Message);
				}
				})
		}
	});
}
rechazarLote(){

	this.ModalService.confirm('¿Está a punto de RECHAZAR el Lote Nro: '+ this.numeroLote +', desea continuar?', (pResult) => {
		if (pResult){

			this.loteDataService.rechazarLote(this.loteLista).then((result) => {
				if (result.IsOk === true) {
					this.AlertaService.NewSuccess("Lote RECHAZADO Correctamente");
				}
				else {
					this.AlertaService.NewWarning(result.Message);
				}
				})
		}
	});
}

 activate(){

	let usuarioActual = this.CredentialsDataService.GetForce();
	this.usuarioElegido.Id     = usuarioActual.id
	this.usuarioElegido.Nombre = usuarioActual.name
	this.usuarioActual = usuarioActual.id.toString() + " - " + usuarioActual.name
	
	this.buscarFiltroGuardado();
	if (this.numeroLote) {
		this.buscar();
	}
	
}






 // #endregion
}
