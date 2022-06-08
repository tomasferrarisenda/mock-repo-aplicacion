/**
* @author: ppautasso
* @description: controller para el repo de elementos de frontend
* @type: Controller
**/
import * as angular from 'angular';
import { IRepoFrontLogicService } from '../../services';

export class RepoElementosFrontEndContenedorController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	codeHtml;
	optionCk;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$scope', 'AlertaService', 'RepoFrontLogicService'];
	/**
	* @class RepoElementosFrontEndContenedorController
	* @constructor
	*/
	constructor(private $log: ILogger,private scope, private AlertaService: IAlertaService, private RepoFrontLogicService:IRepoFrontLogicService) {
	}

	// #endregion

	// #region /* ----------------------------------------- CKEDITOR ----------------------------------------- */
	inicializarEditor() {
		this.optionCk = {
			language: 'es',
			allowedContent: false,
			entities: false,
			// skin : 'kama',
			// Remover botones (sin espacios) http://docs.cksource.com/CKEditor_3.x/Developers_Guide/Toolbar
			// Nombre de los botones https://ckeditor.com/old/forums/CKEditor/Complete-list-of-toolbar-items#comment-123266
			removeButtons: 'Table,About,Source,PasteText,PasteFromWord,RemoveFormat,Link,Unlink,Anchor,Image',
			// Remover pluging
			// removePlugins : 'elementspath',
			// extraPlugins : 'colorbutton'
			// Ver/Ocultar toolbar
			toolbarCanCollapse: true,
			// Redefinir toolbar
			toolbar: [
				{ name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'] },
				{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },

			]
		};
	}


	copiarCodigo() {
		let copyText: any = document.getElementById("textcodehtml");
		if (copyText) {
			copyText.select();
			document.execCommand("copy");
			this.AlertaService.NewSuccess("Codigo JS/HTML copiado al portapapeles!");
		}
	}

	selectCodigo(){
		let copyText: any = document.getElementById("textcodehtml");
		if (copyText) {
			copyText.select();
		}
	}

	scrollToButton() {
		//funcion para scroll abajo
		var elm: any = document.querySelector("#wrapper");
		if (elm){

			// elm.animate({ scrollTop: elm.scrollHeight }, 650);
			window.scrollTo(0, elm.scrollHeight);
		}
	}

	inicializarWatch(){
		this.scope.$watch(() => {
			return this.codeHtml;
		}, (pNewVal) => {
			if(pNewVal){

				this.scrollToButton();
				this.selectCodigo();
			}
		}, true);
	}

	openIconosList(){
		this.RepoFrontLogicService.openRepoIconosFront();
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoElementosFrontEndContenedorController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoElementosFrontEndContenedorController');
		this.$log.debug('ON');
		this.inicializarWatch();
		// this.inicializarEditor();
	}
	// #endregion
}