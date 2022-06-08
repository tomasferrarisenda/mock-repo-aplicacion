/**
* @author: crusso
* @description: Tecnicos del Servicio
* @type: Service
**/
import * as angular from 'angular';
import { TecnicosDelServicioEditComponent } from '../components';

export interface ITecnicoDelServicioLogicService {
	editarTecnicoServicio(id:number): any;
	//nuevoTecnico(id: number): any; //Ayuda al Profesor //
}

class logicService implements ITecnicoDelServicioLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class TecnicoDelServicioLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('TecnicoDelServicioLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	editarTecnicoServicio(idTecnicoDelServicio) {
		return this.$uibModal.open({
			component: TecnicosDelServicioEditComponent.componentName,
			size: 'lg',
			keyboard: true,
			resolve: {
				idTecnicoDelServicio: function () {
					return idTecnicoDelServicio; //Ayuda al Profesor //
				},
			}
		}).result;
	}

	// nuevoTecnico(idTecnicoDelServicio) {
	// 	return this.$uibModal.open({
	// 		component: TecnicosDelServicioEditComponent.componentName,
	// 		size: 'lg',
	// 		keyboard: true,
	// 		resolve: {
	// 			idTecnicoDelServicio: function () {
	// 				return idTecnicoDelServicio; //Ayuda al Profesor //
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

export class TecnicoDelServicioLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TecnicoDelServicioLogicService', logicService.serviceFactory())
	}
}