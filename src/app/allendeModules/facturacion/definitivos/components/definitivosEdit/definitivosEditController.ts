/**
* @author: rbassi
* @description: Edicion de definitivos Controller
* @type: Controller
**/
import * as angular from 'angular';
import {IDefinitivosDataService} from '../../services/definitivosDataService'
import { ICierreRecepcionLogicService } from '../../../../facturacion/cierreRecepcion/services/cierreRecepcionLogicService'
import { StateHelperService } from '../../../../../common/router/services/StateHelperService';
import { ICredentialsDataService } from 'core/security';

export class definitivosEditController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : '', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'EDIT' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 financiadorDefinitivo: string = '';
 servicioDefinitivo:string = '';
 ambitoDefinitivo: string = '';
 fechaDefinitivo: Date = new Date();
 tipoAfiliacionDefinitivo: string = '';
 estadoDefinitivo: string = '';
 definitivoLista: any;
 usuarioElegido: IEntidadDto= {};
 

 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject: Array<string> = ['Logger', '$state', 'AlertaService', '$stateParams','$scope','ModalService','DefinitivosDataService',
 							      'DateUtils','CierreRecepcionLogicService','StateHelperService','CredentialsDataService','ORIGEN_PREFACTURA'];
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
 private ModalService: IModalService,
 private definitivosDataService: IDefinitivosDataService,
 private DateUtils: IDateUtils,
 private cierreRecepcionLogicService: ICierreRecepcionLogicService,
 private StateHelperService,
 private CredentialsDataService: ICredentialsDataService,
 private ORIGEN_PREFACTURA
) {
}
 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class definitivosEditController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('definitivosEditController');
 this.$log.debug('ON');

 this.activate()
 }


 exportarItemsExcel(){
	 this.definitivosDataService.exportarItemsDefinitivoExcel(this.$stateParams.IdDefinitivo).then((result) =>{

	 })
 }

 historicoItem(row: any){
	 this.cierreRecepcionLogicService.historialCambiosSobreItem(row.Id).then((result) => {
	 })

 }

 volver() {
	//this.$state.go('facturacion.definitivosList.list');
	this.StateHelperService.goToPrevState();
}

esVisibleSegunEstado(row: any, idEstado: number){
	return (row.IdEstado !== idEstado)
}

editarItem(row:any){
	this.$state.go('prefacturacion.ambulatorio.new', {
		esNuevo: false,
		id: row.IdOrigenPrefactura,
		idAmbito: this.ORIGEN_PREFACTURA.LISTADO_PREFACTURACION
	});

}

asignarMotivo(row: any, index: any, nombreEstado: string, idEstado: number){
	this.cierreRecepcionLogicService.editarDetalleItemEstadoCierres(row,this.$stateParams.NombreUsuario,nombreEstado,idEstado,this.usuarioElegido && this.usuarioElegido.Id ? this.usuarioElegido.Id : 0).then((result) =>{

		 this.activate();
	
	});
};

 activate(){

	let usuarioActual = this.CredentialsDataService.GetForce();
	this.usuarioElegido.Id     = usuarioActual.id
	this.usuarioElegido.Nombre = usuarioActual.name


	 this.definitivosDataService.ObtenerDefinitivoPorId(this.$stateParams.IdDefinitivo).then((result) =>{
		this.definitivoLista = result;

		this.title.name = 'Edición de definitivo Nro: '+this.definitivoLista.NroDefinitivoLegacy

		this.financiadorDefinitivo = this.definitivoLista.NombreMutual;
		this.servicioDefinitivo = this.definitivoLista.NombreServicio;
		this.ambitoDefinitivo = this.definitivoLista.NombreAmbitoAtencion;
		this.fechaDefinitivo = this.DateUtils.parseToFe(this.definitivoLista.Fecha)? this.DateUtils.parseToFe(this.definitivoLista.Fecha) : this.DateUtils.parseToFe(new Date());
		this.tipoAfiliacionDefinitivo = this.definitivoLista.NombreTipoAfiliado;
		this.estadoDefinitivo = this.definitivoLista.NombreEstadoDefinitivo;
		
	 })
 }
 
 
 
 
 
 // #endregion
}