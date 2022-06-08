/**
* @author: ppautasso
* @description: controller para repo de botones para repo general d front
* @type: Controller
**/
import * as angular from 'angular';

export class RepoFrontBotonesController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	codeHtml;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class RepoFrontBotonesController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	clickElement(event){
		this.$log.debug('event', event.target.outerHTML);
		this.codeHtml = angular.copy(event.target.outerHTML);
	}

	clickElemento(elemento){

		switch (elemento) {
			case 1:
				this.codeHtml = `<button type="button" sa-btn-clean ng-click="vm.btnClean()">Limpiar</button>`
				break;
			case 2:
				this.codeHtml = `<button type="button" sa-btn-save class="btn-success" ng-click="vm.btnSave()">Guardar</button>`
				break;
			case 3:
				this.codeHtml = `<sa-check-box ng-model="model"  label="Label" color="green"></sa-check-box>`
				break;
			case 4:
				this.codeHtml = `<sa-check-box ng-model="model" color="green" label-right="'label izq'" pull-right="true"></sa-check-box>`
				break;
			case 5:
				this.codeHtml = `<button type="button" sa-btn-search class="btn-row btn-block">Buscar</button>`
				break;
				
		}

	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoFrontBotonesController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoFrontBotonesController');
		this.$log.debug('ON');
	}
	// #endregion
}