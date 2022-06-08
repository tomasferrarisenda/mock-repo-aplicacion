/**
* @author: ppautasso
* @description: controller para repo de front para formularios basicos
* @type: Controller
**/
import * as angular from 'angular';

export class RepoFrontFormulariosBasicosController implements angular.IController {

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
	* @class RepoFrontFormulariosBasicosController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	clickElemento(elemento) {

		switch (elemento) {
			case 2:
				this.codeHtml = `<sa-modal-header loading="vm.loading" title-name="title" title-icon="ICON">
</sa-modal-header>

<sa-modal-body loading="vm.loading">

    <div class="row">
    </div>

</sa-modal-body>
<sa-modal-footer loading="vm.loading">
    <button type="button" class="btn btn-default" ng-disabled="vm.loading" ng-click="vm.cerrar()">Cerrar</button>
</sa-modal-footer>`;
				break;
			case 1:
				this.codeHtml = `<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<sa-title title-name="'TITLE'" title-icon="ICON"></sa-title>

		<div class="row fila">
		</div>

		<div class="row">
		</div>

	</div>
</div>
<sa-loading-modal ng-if="vm.loading"></sa-loading-modal>`;
				break;
		}
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoFrontFormulariosBasicosController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoFrontFormulariosBasicosController');
		this.$log.debug('ON');
	}
	// #endregion
}