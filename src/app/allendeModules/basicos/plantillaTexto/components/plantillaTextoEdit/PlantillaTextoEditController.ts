/**
* @author: rbassi
* @description: Planilla Texto Edit Controller
* @type: Controller
**/
import * as angular from 'angular';
import { IPlantillaTextoDataService } from '../../services';
import { plantillaTextoDto } from '../../model';


export class PlantillaTextoEditController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve: any;
	dismiss: any;
	close: any;

	tiposProposito: IEntidadDto[] = [];
	tipoPropositoElegido: IEntidadDto = {};

	tiposFormato: IEntidadDto[] = [];
	tipoFormatoElegido: IEntidadDto = {};

	nombrePlantillaTextoEdit: any;
	descripcionPlantillaTextoEdit: any;
	texto: any;
	optionCk: any = {};
	etiquetasPorTipoProposito: any;
	plantillaEdit: plantillaTextoDto = {}


	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$state', 'ModalService', 'AlertaService', '$stateParams', 'PlantillaTextoDataService', '$q'];
	/**
	* @class PlantillaTextoEditController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private $state,
		private ModalService: IModalService,
		private AlertaService: IAlertaService,
		private $stateParams,
		private plantillaTextoDataService: IPlantillaTextoDataService,
		private $q: angular.IQService,
	) { }

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class PlantillaTextoEditController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/

	Guardar() {
		this.plantillaEdit.Descripcion = this.descripcionPlantillaTextoEdit;
		this.plantillaEdit.IdTipoFormatoPlantillaTexto = this.tipoFormatoElegido.Id;
		this.plantillaEdit.IdTipoPropositoPlantillaTexto = this.tipoPropositoElegido.Id;
		this.plantillaEdit.Nombre = this.nombrePlantillaTextoEdit;
		// 1 HTML
		// 2 TEXTO PLANO
		this.plantillaEdit.Texto = this.texto;
		//this.plantillaEdit.Texto = this.tipoFormatoElegido.Id === 2 ? this.texto.replace(/<(?:.|\n)*?>/gm, '') : this.texto;
		
		this.plantillaTextoDataService.guardar(this.plantillaEdit).then((result) => {
			if (result.IsOk) {
				this.ModalService.success("Se ha guardado la Plantilla de Texto.")
				this.$state.go('basicos.plantillaTexto.list');
			}
			else {
				this.ModalService.warning("Verifique por favor." + result.Message);
			}
		})
	}

	cancelar() {
		this.$state.go('basicos.plantillaTexto.list');
	}

	$onInit() {
		this.$log = this.$log.getInstance('PlantillaTextoEditController');
		this.$log.debug('ON');
		this.activate();
	}

	buscarEtiquetas(IdTipoPropositoPlantillaTexto) {
		this.plantillaTextoDataService.ObtenerEtiquetasPorTipoProposito(IdTipoPropositoPlantillaTexto).then((ResultadoEtiquetas) => {
			this.etiquetasPorTipoProposito = ResultadoEtiquetas;
		})
	}

	seleccionaTipoProposito() {
		this.buscarEtiquetas(this.tipoPropositoElegido.Id);
	}

	activate() {
		if (this.$stateParams.propositoEdit.Id === undefined){
			this.$state.go('basicos.plantillaTexto.list');
		}

		this.plantillaEdit = this.$stateParams.propositoEdit;

		this.title.name = this.plantillaEdit.Id ? 'Modificar Plantilla de Texto' : 'Nueva Plantilla de Texto';
		this.title.icon = this.plantillaEdit.Id ? 'EDIT' : 'NEW';

		this.nombrePlantillaTextoEdit = this.plantillaEdit.Nombre;
		this.descripcionPlantillaTextoEdit = this.plantillaEdit.Descripcion;
		this.texto = this.plantillaEdit.Texto;

		this.plantillaTextoDataService.TiposDeProposito().then((tipos) => {
			this.tiposProposito = tipos;
			this.tipoPropositoElegido = this.tiposProposito[0];
			for (let i = 0; i < this.tiposProposito.length; i++) {
				if (this.tiposProposito[i].Id === this.plantillaEdit.IdTipoPropositoPlantillaTexto) {
					this.tipoPropositoElegido = this.tiposProposito[i];
				}
			}
			this.buscarEtiquetas(this.tipoPropositoElegido.Id);
		});

		this.plantillaTextoDataService.ObtenerTodosTipoFormatoPlantillaTexto().then((tiposFormato) => {
			this.tiposFormato = tiposFormato;
			this.tipoFormatoElegido = this.tiposFormato[0];
			for (let i = 0; i < this.tiposFormato.length; i++) {
				if (this.tiposFormato[i].Id === this.plantillaEdit.IdTipoFormatoPlantillaTexto) {
					this.tipoFormatoElegido = this.tiposFormato[i];
				}
			}
		});

		this.optionCk = {
			language: 'es',
			allowedContent: false,
			entities: false,
			removeButtons: 'Table,About,Source,PasteText,PasteFromWord,Link,Unlink,Anchor,Image',
			toolbarCanCollapse: true,
			toolbar: [
				{ name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'] },
				{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
				{ name: 'editing', groups: ['spellchecker'], items: ['Scayt'] },
				{ name: 'insert', items: ['HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'] },
				{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'BidiLtr', 'BidiRtl'] },
				{ name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
				{ name: 'tools', items: ['Maximize', 'ShowBlocks'] }
			]
		};
	}
	// #endregion
}
