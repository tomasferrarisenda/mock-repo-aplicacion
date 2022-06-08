/**
* @author: rbassi
* @description: cierre Recepcion Edit Controller
* @type: Controller
**/
import * as angular from 'angular';
import { ICierreRecepcionDataService } from '../../services/cierreRecepcionDataService'
import { ICierreRecepcionLogicService } from '../../services/cierreRecepcionLogicService'
import { EstadoLote } from '../../models';
import { ICredentialsDataService } from 'core/security';
import { CredentialDetails } from 'crypto';

export class cierreRecepcionEditController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : '', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
cierreRecepcionDetalle: any = {};
resolve: any;
usuarioElegido: IEntidadDto= {};

 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject: Array<string> = ['Logger', '$state', 'AlertaService', '$stateParams','$scope','CierreRecepcionDataService',
 								  'CierreRecepcionLogicService','ModalService','CredentialsDataService','StateHelperService','ORIGEN_PREFACTURA'];
/**
* @class listasFacturacionListController
* @constructor
*/
constructor(
 private $log: ILogger,
 private $state,
 private AlertaService: IAlertaService,
 private $stateParams,
 private $scope,
 private cierreRecepcionDataService: ICierreRecepcionDataService,
 private cierreRecepcionLogicService: ICierreRecepcionLogicService,
 private ModalService: IModalService,
 private CredentialsDataService : ICredentialsDataService,
 private StateHelperService,
 private ORIGEN_PREFACTURA
) {
}
 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionEditController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionEditController');
 this.$log.debug('ON');
 this.activate();
 }


 cancelar() {
	//this.$state.go('facturacion.cierreRecepcionList.list');
	this.StateHelperService.goToPrevState();
}

imprimir(){
this.cierreRecepcionLogicService.imprimirCierreRecepcion(this.cierreRecepcionDetalle).then((result) => {

})
}

exportarExcelItemsCierresRecepcion(){
	this.cierreRecepcionDataService.exportarItemsCierreExcel(this.$stateParams.IdCierreRecepcion).then((result) => {

	})
}

asignarMotivoFacturableNoFacturable(row: any, index: any, nombreEstado: string, idEstado: number){
	this.cierreRecepcionLogicService.editarDetalleItemEstadoCierres(row,this.cierreRecepcionDetalle.NombreUsuarioCierre,nombreEstado,idEstado,this.usuarioElegido && this.usuarioElegido.Id ? this.usuarioElegido.Id : 0).then((result) =>{

		 this.activate();
	
	});
};

esVisibleSegunEstado(row: any, idEstado: number, esDeParticulares: boolean){
	this.$log.debug("EsVisibleSegunEstado",row)
	this.$log.debug("EsVisibleSegunEstadoParticulares",esDeParticulares)
	return (row.IdEstado !== idEstado && row.IdEstado !== 5 && esDeParticulares!== true)
}

historicoSobreItem(row: any){
	this.cierreRecepcionLogicService.historialCambiosSobreItem(row.Id).then((result) =>{
	});
};



editarItem(row:any){
	 this.$state.go('prefacturacion.ambulatorio.new', {
	 	esNuevo: false,
	 	id: row.IdOrigenPrefactura,
	 	idAmbito: this.ORIGEN_PREFACTURA.LISTADO_PREFACTURACION
	 });

}

activate(){


	let usuarioActual = this.CredentialsDataService.GetForce();
	this.usuarioElegido.Id     = usuarioActual.id
	this.usuarioElegido.Nombre = usuarioActual.name


	this.cierreRecepcionDataService.obtenerPorId(this.$stateParams.IdCierreRecepcion).then((resultado) =>{
		this.cierreRecepcionDetalle = resultado;
		this.title.name = 'Edición de cierre de Recepcion: '+this.$stateParams.NroCierreLegacy+ ' - Usuario: '+this.cierreRecepcionDetalle.NombreUsuarioCierre ;
		this.$log.debug("this.cierreRecepcionDetalle",this.cierreRecepcionDetalle)
	});
};



 // #endregion
}
