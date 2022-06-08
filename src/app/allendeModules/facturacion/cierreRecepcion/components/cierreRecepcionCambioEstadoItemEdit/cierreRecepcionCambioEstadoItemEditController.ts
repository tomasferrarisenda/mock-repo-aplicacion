/**
* @author: rbassi
* @description: cierre de recepcion cambiar estado del ietm controller
* @type: Controller
**/
import * as angular from 'angular';
import { ISupportDataService } from '../../../../support/basic/services';
import { ICierreRecepcionDataService } from '../../services/cierreRecepcionDataService'
import {motivoEstadoDTO, cambioEstadoLoteItemPrefacturadoDTO} from '../../models'

export class cierreRecepcionCambioEstadoItemEditController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Cambio de Estado del ítem', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'EDIT' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..

 usuario: string = '';
 fechayHora: string = '14/09/2018 16:12';
 estado: string = '';
 resolve: any;
 dismiss: any;
 close: any;
 estadoLista:motivoEstadoDTO[] = [];
 estadoElegido: motivoEstadoDTO = {};
 idEstadoItem: number = 0;
 itemGuardarCambio: cambioEstadoLoteItemPrefacturadoDTO  = {};
 observacionEstado: string = "";
 puedeElegirMotivo: boolean = true;

 
 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger', '$q', 'ModalService', 'SupportDataService', 'AlertaService','CierreRecepcionDataService','DateUtils'];
 /**
 * @class cierreRecepcionCambioEstadoItemEditController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	 private $q: angular.IQService,
	 private ModalService: IModalService,
	 private SupportDataService: ISupportDataService,
	 private AlertaService: IAlertaService,
	 private cierreRecepcionDataService: ICierreRecepcionDataService,
	 private DateUtils : IDateUtils,
){
 }

 
// #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionCambioEstadoItemEditController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionCambioEstadoItemEditController');
 this.$log.debug('ON');
 this.activate();
}

cambioEstado(){
	//this.$log.debug('Estado Elegido', this.estadoElegido);	
}

cancelar(){
	this.dismiss({ $value: 'cancel' });
 }

 guardar(){
	this.itemGuardarCambio.IdItemPrefacturado = this.resolve.itemDetalle.Id
	this.itemGuardarCambio.IdEstadoLoteItem = this.resolve.itemDetalle.IdEstado
	this.itemGuardarCambio.IdMotivoCambioEstadoLoteItemPrefacturado = this.estadoElegido.Id
	this.itemGuardarCambio.IdUsuarioAlta = this.resolve.idUsuario 
	this.itemGuardarCambio.NombreUsuarioAlta = this.resolve.nombreUsuarioCierre
	this.itemGuardarCambio.Observaciones = this.observacionEstado
	this.itemGuardarCambio.FechaAlta  = new Date();

	switch (this.estado) {
		case 'Normal':
			this.cierreRecepcionDataService.pasarItemPrefacturaANormal(this.itemGuardarCambio).then((Resultado) => {
				if (Resultado.IsOk === true){
					this.close({ $value: 'true' });
				} else {
					this.ModalService.warning(Resultado.Message);
				}

			});
			break;
		case 'Pendiente':
			this.cierreRecepcionDataService.pasarItemPrefacturaAPendiente(this.itemGuardarCambio).then((Resultado) => {
				if (Resultado.IsOk === true){
					this.close({ $value: 'true' });
				} else {
					this.ModalService.warning(Resultado.Message);
				}
			});
			break;
		case 'En Espera':
			this.cierreRecepcionDataService.pasarItemPrefacturaAEnEspera(this.itemGuardarCambio).then((Resultado) => {
				//this.$log.debug('Robledo me devulve: ',Resultado)
				if (Resultado.IsOk === true){
					this.close({ $value: 'true' });
				} else {
					this.ModalService.warning(Resultado.Message);
				}
			});
			break;
		case 'Incobrable':
			this.cierreRecepcionDataService.pasarItemPrefacturaAIncobrable(this.itemGuardarCambio).then((Resultado) => {
				if (Resultado.IsOk === true){
					this.close({ $value: 'true' });
				} else {
					this.ModalService.warning(Resultado.Message);
				}
			});
		case 'Devuelto':
		this.cierreRecepcionDataService.pasarItemPrefacturaADevuelto(this.itemGuardarCambio).then((Resultado) => {
			if (Resultado.IsOk === true){
				this.close({ $value: 'true' });
			} else {
				this.ModalService.warning(Resultado.Message);
			}
		});
		break;
	}
	
 }

 activate(){
	 	this.usuario = this.resolve.nombreUsuarioCierre;
		this.estado = this.resolve.nombreEstado
		//this.$log.debug('TODO EL DETALLE ', this.resolve.itemDetalle)	
		this.idEstadoItem =  this.resolve.idEstado
		this.cierreRecepcionDataService.obtenerMotivoSegunEstado(this.idEstadoItem).then((resultado) => {
			if (resultado && resultado[0] !== undefined) { 
				this.estadoLista = resultado; 
				this.puedeElegirMotivo = true;
			}
			else {
				this.puedeElegirMotivo = false;
			};
			
		});
 };



 // #endregion
}	