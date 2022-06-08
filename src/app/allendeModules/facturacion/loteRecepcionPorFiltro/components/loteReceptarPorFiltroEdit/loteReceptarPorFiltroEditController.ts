/**
* @author: rbassi
* @description: loteReceptarPorFiltroEdit controller
* @type: Controller
**/
import * as angular from 'angular';
import { IloteDataService } from '../../../lote/services/loteDataService'
import {IDefinitivosLogicService} from '../../../definitivos/services/definitivosLogicService'
import {IDefinitivosDataService} from '../../../definitivos/services/definitivosDataService'

export class loteReceptarPorFiltroEditController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Detalle del Lote', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
loteRecibido:any;
loteLista:any;

 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','$stateParams','loteDataService','StateHelperService','$state','ModalService','AlertaService',
'DefinitivosLogicService','DefinitivosDataService'];
 /**
 * @class loteReceptarPorFiltroEditController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	 private $stateParams,
	 private loteDataService: IloteDataService,
	 private StateHelperService,
	 private $state,
	 private ModalService : IModalService,
	 private AlertaService: IAlertaService,
	 private definitivoLogicService : IDefinitivosLogicService,
	 private definitivoDataService : IDefinitivosDataService,

	 ){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class loteReceptarPorFiltroEditController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('loteReceptarPorFiltroEditController');
 this.$log.debug('ON');
 this.activate();
 }

 volver() {
	//this.$state.go('facturacion.definitivosList.list');
	this.StateHelperService.goToPrevState();
}

receptarLote(){

	this.ModalService.confirm('¿Desea Receptar el Lote Nro: '+ this.loteRecibido.NroLoteLegacy +'?', (pResult) => {
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

	this.ModalService.confirm('¿Está a punto de RECHAZAR el Lote Nro: '+ this.loteRecibido.NroLoteLegacy +', desea continuar?', (pResult) => {
		if (pResult){

			this.loteDataService.rechazarLote(this.loteLista).then((result) => {
				if (result.IsOk === true) {
					this.AlertaService.NewSuccess("Lote Rechazado Correctamente");
				}
				else {
					this.AlertaService.NewWarning(result.Message);
				}
				})
		}
	});
}


imprimirDefinitivo(row: any){
	this.definitivoDataService.imprimirDefinitivo(row.IdDefinitivo).then((resultadoImprimir) => {

		this.definitivoLogicService.imprimirReporteDefinitivo(resultadoImprimir).then((result) => {
		})

	})
}

editarDefinitivo(row: any){
	this.$state.go('facturacion.definitivosList.edit',{
		IdDefinitivo: row.IdDefinitivo,
		NombreUsuario : ""
	});
}


activate(){

	this.title.name = 'Detalle del Lote Nro: '+this.$stateParams.lote.NroLoteLegacy
	this.loteRecibido = this.$stateParams.lote;
	if (this.loteRecibido){
		this.loteDataService.obtenerLotePorNumeroDeLote(this.loteRecibido.NroLoteLegacy).then((resultadoLote) => {
			this.loteLista = resultadoLote;
		})
	}
}

 // #endregion
}