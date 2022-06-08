/**
* @author: rbassi
* @description: historico de cmabios sobre el item controller
* @type: Controller
**/
import * as angular from 'angular';
import { ISupportDataService } from '../../../../support/basic/services';
import { ICierreRecepcionDataService } from '../../services';

export class cierreRecepcionHistoricoItemController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Historial de cambios sobre el ítem', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 dismiss: any;
 close: any;
 historicoDetalle: any;
 nombrePaciente: string = '';
 nombreFinanciador: string = '';
 nombreProfesional: string = '';
 fecha: Date = new Date();
 codigo: string = '';
 
 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger', '$q', 'ModalService', 'SupportDataService', 'AlertaService','CierreRecepcionDataService','DateUtils'];
 /**
 * @class cierreRecepcionHistoricoItemController
 * @constructor
 */
constructor(
	private $log: ILogger,
	private $q: angular.IQService,
	private ModalService: IModalService,
	private SupportDataService: ISupportDataService,
	private AlertaService: IAlertaService,
	private cierreRecepcionDataService: ICierreRecepcionDataService,
	private DateUtils: IDateUtils
){
}
 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionHistoricoItemController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionHistoricoItemController');
 this.$log.debug('ON');
 this.activate();
 }

 volver(){
	this.dismiss({ $value: 'cancel' });
 }


activate(){
	this.cierreRecepcionDataService.obtenerHistoricoSobreItem(this.resolve.idItemPrefactura).then((result) => {
		this.historicoDetalle = result;

		this.nombrePaciente= this.historicoDetalle.Paciente
	    this.nombreFinanciador= this.historicoDetalle.Financiador
        this.nombreProfesional= this.historicoDetalle.Profesional
        this.fecha= this.DateUtils.parseToFe(this.historicoDetalle.Fecha)? this.DateUtils.parseToFe(this.historicoDetalle.Fecha) : this.DateUtils.parseToFe(new Date());
        this.codigo= this.historicoDetalle.Codigo
 
	})
}



 // #endregion
}