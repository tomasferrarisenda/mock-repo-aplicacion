/**
* @author:         emansilla
* @description:    Acceso a datos para Persona
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IPersonaDataService {

	getOnePersonaByDocumento(idTipoDocumento: number, numeroDocumento: string): angular.IPromise<any>;
	getOnePersonaById(id: number): angular.IPromise<any>;
	addOnePersona(persona): angular.IPromise<any>;
	addTelefono(idPersona, telefono): angular.IPromise<any>;
}

class dataService implements IPersonaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	 * @class       PersonaDataService
	 * @constructor
	 */
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('PersonaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getOnePersonaByDocumento(pIdTipoDocumento, pNumeroDocumento) {
		var _url = 'legacy/Persona/GetByDocumento/' + pIdTipoDocumento + '/' + pNumeroDocumento;
		return this.DtoService.Get(_url);
	}

	getOnePersonaById(pIdPersona) {
		var _url = 'Persona/' + pIdPersona;
		return this.DtoService.Get(_url);
	}

	addOnePersona(pPersona) {
		var _url = 'legacy/Persona/Add';
		return this.DtoService.Post(_url, pPersona);
	}

	addTelefono(idPersona, telefono) {
		var _url = 'legacy/Persona/AddTelefono/${idPersona}';
		return this.DtoService.Post(_url, telefono);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class PersonaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PersonaDataService', dataService.serviceFactory())
	}
}