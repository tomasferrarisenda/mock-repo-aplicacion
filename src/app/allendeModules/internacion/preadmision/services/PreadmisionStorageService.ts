/**
* @author:         emansilla
* @description:    Storage for preadmision module
* @type:           Service
**/
import * as angular from 'angular';

export interface IPreadmisionStorageService {
	savePreadmision(preadmision): any;
	havePreadmision(): boolean;
	getPreadmision(): any;

	saveFormData(formData, formState:boolean): any;
	getFormData(): { formData: any, formState: boolean };
	haveFormData(): any;
}

class logicService implements IPreadmisionStorageService {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

	preadmision;
	formData;
	formState;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	 * @class       PreadmisionStorageService
	 * @constructor
	 */
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('PreadmisionStorageService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	savePreadmision(preadmision) {
		this.preadmision = preadmision;
	}

	saveFormData(formData, formState) {
		this.formData = formData;
		this.formState = formState;
	}

	havePreadmision(): boolean {
		if (this.preadmision) return true;
		return false;
	}

	haveFormData(): boolean {
		if (this.formData) return true;
		return false;
	}

	getPreadmision() {
		let solicitud = angular.copy(this.preadmision);
		this.preadmision = null;
		return solicitud;
	}

	getFormData() {
		let data = angular.copy(this.formData);
		let state = angular.copy(this.formState);
		this.formData = null;
		this.formState = null;
		return {
			formData: data,
			formState: state
		};
	}

	static serviceFactory() {
		const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
		service.$inject = ['Logger', '$uibModal', 'DateUtils'];
		return service
	}

	// #endregion
}

export class PreadmisionStorageService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PreadmisionStorageService', logicService.serviceFactory())
	}
}