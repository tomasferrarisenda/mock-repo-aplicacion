/**
* @author: Piter
* @description: Documento Logic
* @type: Service
**/
import * as angular from 'angular';
import { AdministradorDocumentoEditComponent } from '../components/AdministradorDocumentos/AdministradorDocumentosEditComponent';
import { ListadoDocumentosPrintComponent } from '../components/ListadoDocumentacion/ListadoDocumentosPrint/ListadoDocumentosPrintComponent';

export interface IAdministradorDocumentoLogicService {
	seleccionarTipoEntidad(idTipoEntidadElegida : number): any;
	editarDocumentoAsociado(idDocumento: number, idTipoEntidad?: number, idEntidad?: number): any;
	imprimirListado(entidadElegida : any, entidadFiltrada : any, listado : any) : any;
}

class logicService implements IAdministradorDocumentoLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class AdministradorDocumentoLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('AdministradorDocumentoLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	editarDocumentoAsociado(idDocumento, idTipoEntidad, idEntidad) {
		return this.$uibModal.open({
			component: AdministradorDocumentoEditComponent.componentName,
			size: 'lg',
			keyboard: true,
			resolve: {
				idDocumento: function () {
					return idDocumento;
				},
				idTipoEntidad: function () {
					return idTipoEntidad;
				},
				idEntidad: function () {
					return idEntidad;
				}
			}
		}).result;
	}
	
	imprimirListado(entidadElegida, entidadFiltrada, listado) {
		return this.$uibModal.open({
			component: 'saListadoDocumentosPrint',
			size: 'lg',
			keyboard: true,
			resolve: {
				entidadElegida: function () {
					return entidadElegida;
				},
				entidadFiltrada: function () {
					return entidadFiltrada;
				},
				listado: function () {
					return listado;
				}
			}
		}).result;
	}



	seleccionarTipoEntidad(idTipoEntidadElegida) {
		return this.$uibModal.open({
			component: 'saSelectorEntidad',
			size: 'lg',
			keyboard: true,
			resolve: {
				idTipoEntidadElegida: function () {
					return idTipoEntidadElegida;
				},
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

export class AdministradorDocumentoLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('AdministradorDocumentoLogicService', logicService.serviceFactory())
	}
}