/**
* @author: rbassi
* @description: item lista facturacion Edit controller
* @type: Controller
**/
import * as angular from 'angular';
import { IlistasFacturacionDataService } from '../../services';
import { itemListaFacturacionDTO } from '../../models';
import { ISupportDataService } from '../../../../../../allendeModules/support/basic/services';
import { PrefacturableDto } from '../../../../../../allendeModules/support/models';

export class itemListasFacturacionEditController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	
	resolve: any;
	dismiss: any;
	close: any;
	itemListaFacturacion: itemListaFacturacionDTO = {};
	tipoPrefacturable: IEntidadDto = {};
	tipoPrefacturablesCombo: IEntidadDto[] = [];
	prefacturableElegido: PrefacturableDto = {};
	initTipo: { Id? : number } = {};

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'listasFacturacionDataService', '$q', 'ModalService', 'SupportDataService', 'AlertaService'];
	/**
	* @class itemListasFacturacionEditController
	* @constructor
	*/
	constructor(private $log: ILogger,
		private listasFacturacionDataService:IlistasFacturacionDataService,
		private $q: angular.IQService,
		private ModalService: IModalService,
		private SupportDataService: ISupportDataService,
		private AlertaService: IAlertaService
	) { }


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class itemListasFacturacionEditController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/



	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar(){
		this.$log.debug('Devuelvo prefacturable Elegido', this.prefacturableElegido);
		if(this.prefacturableElegido && this.prefacturableElegido.Id){
			this.itemListaFacturacion.IdPrefacturable = this.prefacturableElegido.Id;
			this.itemListaFacturacion.Nombre = this.prefacturableElegido.Nombre;
			this.itemListaFacturacion.Codigo = this.prefacturableElegido.Codigo;
			this.itemListaFacturacion.IdTipoPrefacturable = this.prefacturableElegido.IdTipo;
			this.itemListaFacturacion.NombreTipoPrefacturable = this.prefacturableElegido.NombreTipo;
			this.close({ $value: this.itemListaFacturacion });
		}else {
			this.AlertaService.NewWarning("Atención", "Debe seleccionar un item prefacturable");
		}
	}

	
	$onInit() {
		this.$log = this.$log.getInstance('itemListasFacturacionEditController');
		this.$log.debug('ON ID LISTA: ', this.resolve.idPrefacturable);

		this.activate()
	}

	activate(){
		this.initTipo.Id = this.resolve.tipoPrefacturableLista ? this.resolve.tipoPrefacturableLista : 0;

		let idPrefacturable = this.resolve.item ? this.resolve.item.IdPrefacturable : 0;

		this.title.name = idPrefacturable ? "Editar Item de la Lista" : "Agregar Item a la Lista";
		this.title.icon = idPrefacturable ? "EDIT" : "NEW";
		
		if (idPrefacturable === 0){
				this.itemListaFacturacion = {};
				this.prefacturableElegido = {};
				this.listasFacturacionDataService.obtenerNuevoItemEdit().then((resultadoNuevoItem) => {
					this.$log.debug('Resultado obtenerNuevoItemEdit: ', resultadoNuevoItem);
			});
		}
		else {
			this.SupportDataService.ObtenerPrefacturablePorId(this.resolve.item.IdTipoPrefacturable, this.resolve.item.IdPrefacturable)
			.then((prefacturableElegido) => {
				this.prefacturableElegido = prefacturableElegido;
				this.itemListaFacturacion = this.resolve.item;
			})

		}

	}


	// #endregion
}	
