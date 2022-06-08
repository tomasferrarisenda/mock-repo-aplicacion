/**
 * @author:			Ezequiel Mansilla
 * @description:	Creación de exceptions
 * @type:			Service
 **/
import * as angular from 'angular';

class AllendeException {
	message;
	type;
	block;

	constructor(message, type, block){
		this.message = message;
		this.type = type || 'sin controlar';
		this.block = angular.isUndefined(block) ? true : block;
	}
}

export default class {
	public static init(ngModule: any){
		
		AllendeExceptionService.$inject = [];
		function AllendeExceptionService () {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('AllendeException');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			function AllendeException (pMessage, pType, pBlock) {
				this.message = pMessage;
				this.type = pType || 'sin controlar';
				this.block = angular.isUndefined(pBlock) ? true : pBlock;
			}

			return AllendeException;
		}
		ngModule.factory('AllendeException', AllendeExceptionService);
	}
}