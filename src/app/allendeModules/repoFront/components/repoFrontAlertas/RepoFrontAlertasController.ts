/**
* @author: ppautasso
* @description: controller para repo front de alertas
* @type: Controller
**/
import * as angular from 'angular';
import { IRepoFrontLogicService } from '../../services';

export class RepoFrontAlertasController implements angular.IController {

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
	static $inject: Array<string> = ['Logger', 'AlertaService', 'RepoFrontLogicService'];
	/**
	* @class RepoFrontAlertasController
	* @constructor
	*/
	constructor(private $log: ILogger, private AlertaService: IAlertaService,private RepoFrontLogicService:IRepoFrontLogicService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	clickElemento(elemento) {

		switch (elemento) {
			case 1:
				this.codeHtml = `AlertaService.NewWarning("Atención","Nuevo warning!");`;
				this.AlertaService.NewWarning("Atención","Nuevo warning!");
				break;
			case 2:
				this.codeHtml = `this.AlertaService.NewError("Error!", "Ha ocurrido un error");`;
				this.AlertaService.NewError("Error!", "Ha ocurrido un error");
				break;
			case 3:
				this.codeHtml = `this.AlertaService.NewInfo("Información", "Informacion...");`;
				this.AlertaService.NewInfo("Información", "Informacion...");
				break;
			case 4:
				this.codeHtml = `this.AlertaService.NewSuccess("Accion Exitosa", "El elemento x ha sido guardado");`;
				this.AlertaService.NewSuccess("Accion Exitosa", "El elemento x ha sido guardado");
				break;
		}
	}
	

	openBarCode(){
		this.RepoFrontLogicService.openModalBarCode();
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoFrontAlertasController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoFrontAlertasController');
		this.$log.debug('ON');
		
	}
	// #endregion
}