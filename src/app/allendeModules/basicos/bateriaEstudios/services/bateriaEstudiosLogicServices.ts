/**
* @author: crusso
* @description: Bateria de Estudios Logic Service
* @type: Service
**/
import * as angular from 'angular';
import { bateriaEstudiosEditDto, itemBateriaEstudiosEditDto } from '../model';
import { itemBateriaEstudiosEditComponent } from '../components';

export interface IBateriaEstudiosLogicService {
    editarItemBateriaEstudios(
        itemBateriaEstudioEdit: itemBateriaEstudiosEditDto,
        nombreBateria: string,
        idServicioPropietario: number,
        nombreProfesionalPropietario: string
    ): angular.IPromise<itemBateriaEstudiosEditDto>
}

class logicService implements IBateriaEstudiosLogicService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class bateriaEstudiosLogicService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('bateriaEstudiosLogicService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    // editarItemBateriaEstudios(itemBateriaEstudioEdit, idServicio) {
	// 	return this.$uibModal.open({
	// 		component: itemBateriaEstudiosEditComponent.componentName,
	// 		size: 'lg',
	// 		keyboard: true,
	// 		resolve: {
	// 			itemBateriaEstudioEdit: function () {
	// 				return itemBateriaEstudioEdit;
	// 			},
	// 		}
	// 	}).result;
	// }

    editarItemBateriaEstudios(itemBateriaEstudioEdit, nombreBateria, idServicioPropietario, nombreProfesionalPropietario) {
		return this.$uibModal.open({
			component: itemBateriaEstudiosEditComponent.componentName,
			size: 'lg',
			keyboard: true,
			resolve: {
				itemBateriaEstudioEdit: function () {
					return itemBateriaEstudioEdit;
                },
                nombreBateria: function () {
					return nombreBateria;
                },
                idServicioPropietario: function () {
                    return idServicioPropietario;
                },
                nombreProfesionalPropietario: function () {
                    return nombreProfesionalPropietario;
                }
			}
		}).result;
	}

    static serviceFactory() {
        const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
        service.$inject = ['Logger', '$uibModal', 'DateUtils'];
        return service
    }

    // #endregion
}

export class bateriaEstudiosLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('bateriaEstudiosLogicService', logicService.serviceFactory())
    }
}