/**
* @author: crusso
* @description: Logic Service Gestion Recepcion
* @type: Service
**/
import * as angular from 'angular';
import { gestionRecepcionEditComponent } from '../components';

export interface IGestionRecepcionLogicService {
    //nuevoGestionRecepcion(id:number): any;
    method(): any;
}

class logicService implements IGestionRecepcionLogicService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class GestionRecepcionLogicService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('GestionRecepcionLogicService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    
    //Metodo por el cual funciona para el boton "+" del Edit Html
    // nuevoGestionRecepcion(idGestionRecepcion) {
	// 	return this.$uibModal.open({
	// 		component: gestionRecepcionEditComponent,
	// 		size: 'lg',
	// 		keyboard: true,
	// 		resolve: {
	// 			idGestionRecepcion: function () {
	// 				return idGestionRecepcion; 
	// 			},
	// 		}
	// 	}).result;
	// }
   
    method() {
        // body
    }

    static serviceFactory() {
        const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
        service.$inject = ['Logger', '$uibModal', 'DateUtils'];
        return service
    }

    // #endregion
}

export class GestionRecepcionLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('GestionRecepcionLogicService', logicService.serviceFactory())
    }
}