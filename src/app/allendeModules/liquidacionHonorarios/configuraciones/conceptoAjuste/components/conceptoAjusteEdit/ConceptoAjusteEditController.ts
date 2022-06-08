/**
* @author: crusso
* @description: Editar Controller Ajuste
* @type: Controller
**/
import * as angular from 'angular';
import { IConceptoAjusteDataService } from '../../services/ConceptoAjusteDataService';
import { IConceptoAjusteLogicService } from "../../services/ConceptoAjusteLogicService";
import { filtroConceptoAjustesDTO, ConceptoAjusteDto } from "../../modal"
// import AlertaDataService from 'core/notification/alerta/services/AlertaDataService';

//import { ConceptoAjusteDto } from '../../../../common/models/conceptoDeAjusteDto';

export class ConceptoAjusteEditController implements angular.IController {
	static $inject: Array<string> = ['Logger', 'ModalService', 'ConceptoAjusteDataService', 'ConceptoAjusteLogicService', '$q', 'AlertaService'];
	/**
	* @class conceptoAjusteEditController
	* @constructor
	*/
	// Constructor
	constructor(
		private $log: ILogger,
		private ModalService: IModalService,
		private ConceptoAjusteDataService: IConceptoAjusteDataService,
		private ConceptoAjusteLogicService: IConceptoAjusteLogicService,
		private $q: angular.IQService,
		private AlertaService : IAlertaService
	) {}

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Modificar Concepto de Ajuste', // Desde la vista (HTML) se accede con vm.title.name
		icon: 'EDIT' // Desde la vista (HTML) se accede con vm.title.icon
	};

	// mas propiedades ..
	resolve;
	dismiss;
	close;

	concepto : ConceptoAjusteDto = {};
	filtroConceptoDto: filtroConceptoAjustesDTO = {};

	tiposConcepto: IEntidadDto [] = [];
	conceptoElegido : IEntidadDto = {};

	//Para Guardar información //

	data = {
		concepto: [],
		tipo: [],
		conceptoEdit: {}
	};

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar(esValido) {
		if (esValido) return this.AlertaService.NewWarning("Verifique los datos ingresados.", "");
		this.concepto.IdTipoConcepto = (this.conceptoElegido && this.conceptoElegido.Id) ? this.conceptoElegido.Id : 0;
		
	 	this.ConceptoAjusteDataService.guardar(this.concepto).then((result) => {
	 		if (result.IsOk) {
	 			this.ModalService.success("Se ha guardado el concepto ajuste.");
	 			this.close({ $value: result });
	 		}
	 		else {
	 			this.ModalService.warning("Verifique por favor. " + result.Message);
	 		}
	 	});
	}

	// #region /* ------------------------------------------ MÉTODOS ------------------------------------------ */
	
	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class conceptoAjusteEditController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('conceptoAjusteEditController');
		this.$log.debug('ON');
		this.activate();
	}

	activate() {
		// console.log("Muestro el Id:", this.resolve.idConceptoAjuste);
		this.title.name = this.resolve.idConceptoAjuste ? 'Modificar Concepto de Ajuste' : 'Nuevo Concepto de Ajuste';
		this.title.icon = this.resolve.idConceptoAjuste ? 'EDIT' : 'NEW';
		
		//Cargar Tipo Combo //
		this.obtenerConceptoAjuste().then((concepto) => {
			//llamo los datos en el input nombre
			this.concepto = concepto;

			this.ConceptoAjusteDataService.obtenerTodosTiposConcepto().then((tiposConcepto) => {
				this.tiposConcepto = tiposConcepto;

				this.conceptoElegido = this.tiposConcepto[0];

				for (let i = 0; i < this.tiposConcepto.length; i++) {
					if (this.tiposConcepto[i].Id === this.concepto.IdTipoConcepto) {
						this.conceptoElegido = this.tiposConcepto[i];
						break;
					}
				}
			});
		});
	 }
	
	obtenerConceptoAjuste() {
		var def = this.$q.defer();
		if (this.resolve.idConceptoAjuste) {
			this.ConceptoAjusteDataService.getOne(this.resolve.idConceptoAjuste).then((TipoConcepto) => {
				def.resolve(TipoConcepto);
			});
		}
		else {
			this.ConceptoAjusteDataService.nuevoConceptoAjuste().then((TipoConcepto) => {
				def.resolve(TipoConcepto);
			});
		}
		return def.promise;
	}

	// #endregion
}