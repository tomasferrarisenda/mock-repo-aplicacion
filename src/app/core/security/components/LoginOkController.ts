/**
* @author:         emansilla
* @description:    Setea el token y el usuario y busca la información de seguridad
* @type:           Controller
**/
import * as angular from 'angular';
import { ISecurityLogicService } from '../services/SecurityLogicService';
import { ICredentialsDataService } from '../services/CredentialsDataService';

export class LoginOkController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name : 'Prueba',
		icon : 'NEW'
	};

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$state', '$stateParams', 'CredentialsDataService', 'SecurityLogicService'];
	/**
	 * @class       LoginOkController
	 * @constructor
	 */
	constructor(
		private $log: ILogger,
		private $state: any,
		private $stateParams: any,
		private credentialsDataService: ICredentialsDataService,
		private securityDataService: ISecurityLogicService){}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	public method(param1: string) : void { // Desde la vista (HTML) se accede con vm.method(algo)
		
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	 * @class       LoginOkController
	 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	 * @event
	*/
	$onInit() {
	   this.$log = this.$log.getInstance('LoginOkController');
	   this.$log.debug('ON');
	   this.$log.debug('Params', this.$stateParams);
		let credentials = this.credentialsDataService.Create(this.$stateParams.userName, this.$stateParams.token)
		this.securityDataService.LoginOk(credentials, this.$stateParams.redirecTo)
		.then(ok => {
			this.$log.debug('Respuesta login ok de service', ok);
		}, error => {
				this.$log.debug('Respuesta login error de service',error);
		})

	}
	// #endregion
}