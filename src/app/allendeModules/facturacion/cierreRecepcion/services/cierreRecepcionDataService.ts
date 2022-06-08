/**
* @author: rbassi
* @description: cierre Recepcion Data Service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { filtroCierreRecepcionDTO } from '../models';
import { motivoEstadoDTO } from '../models/motivoEstadoDTO'
import { cambioEstadoLoteItemPrefacturadoDTO } from '../models/cambioEstadoLoteItemPrefacturadoDTO';


export interface ICierreRecepcionDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorFiltro(filtroDto: filtroCierreRecepcionDTO): angular.IPromise<GridViewDto<any>>;
	obtenerPorId(id: number): angular.IPromise<any>;
	obtenerMotivoSegunEstado(idEstadoLoteItem: number): angular.IPromise<any>;
	obtenerHistoricoSobreItem(idItemPrefactura): angular.IPromise<any>;
	pasarItemPrefacturaANormal(cambioDTO: cambioEstadoLoteItemPrefacturadoDTO): angular.IPromise<any>;  
	pasarItemPrefacturaAPendiente(cambioDTO: cambioEstadoLoteItemPrefacturadoDTO): angular.IPromise<any>;  
 	pasarItemPrefacturaAEnEspera(cambioDTO: cambioEstadoLoteItemPrefacturadoDTO): angular.IPromise<any>;
	pasarItemPrefacturaAIncobrable(cambioDTO: cambioEstadoLoteItemPrefacturadoDTO): angular.IPromise<any>;
	pasarItemPrefacturaADevuelto(cambioDTO: cambioEstadoLoteItemPrefacturadoDTO): angular.IPromise<any>;
	generarCierrePorUsuario(idUsuario,fechaDesde, fechaHasta, idServicio, idSucursal, obrasSociales, particulares): angular.IPromise<any>;
	generarCierrePorUsuarioParaControl(idUsuario,fechaDesde, fechaHasta, idServicio, idSucursal, obrasSociales, particulares): angular.IPromise<GridViewDto<any>>;
	eliminarCierreRecepcion(id): angular.IPromise<any>;
	exportarCierresExcel(cierre):angular.IPromise<any>;
	exportarItemsCierreExcel(idCierre):angular.IPromise<any>;
	obtenerCierresPorIdsParaImpresion(listaIdsCierres):angular.IPromise<any>;
	obtenerDefinitivosPorIdsParaImpresion(listaIdsDefinitivos):angular.IPromise<any>;
	obtenerLotesPorIdsParaImpresion(listaIdsLotes):angular.IPromise<any>;

}

class dataService implements ICierreRecepcionDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class CierreRecepcionDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('CierreRecepcionDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Api/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Api/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorFiltro(filtroDto) {
		var _url = 'CierreRecepcion/ObtenerPorFiltro';
		return this.DtoService.Post(_url, filtroDto);
	}

	obtenerPorId(id) {
		var _url = 'CierreRecepcion/ObtenerPorId/' + id;
		return this.DtoService.Get(_url);
	}

	obtenerMotivoSegunEstado(idEstadoLoteItem) {
		var url = 'MotivoCambioEstadoLoteItemPrefacturado/ObtenerSegunEstadoLote/' + idEstadoLoteItem;
		return this.DtoService.Get(url);
	};

	obtenerHistoricoSobreItem(idItemPrefactura) {
		var url = 'CambioEstadoLoteItemPrefacturado/ObtenerHistorialCambiosEstadoLoteItemPrefactura/' + idItemPrefactura;
		return this.DtoService.Get(url);
	};

	pasarItemPrefacturaANormal(cambioDTO) {
		var url = 'CambioEstadoLoteItemPrefacturado/PasarItemPrefacturaANormal'
		return this.DtoService.Post(url, cambioDTO);
	};

	pasarItemPrefacturaAPendiente(cambioDTO) {
		var url = 'CambioEstadoLoteItemPrefacturado/PasarItemPrefacturaAPendiente'
		return this.DtoService.Post(url, cambioDTO);
	};

 	pasarItemPrefacturaAEnEspera(cambioDTO) {
		var url = 'CambioEstadoLoteItemPrefacturado/PasarItemPrefacturaAEnEspera'
		return this.DtoService.Post(url, cambioDTO);
	};

	pasarItemPrefacturaAIncobrable(cambioDTO) {
		var url = 'CambioEstadoLoteItemPrefacturado/PasarItemPrefacturaAIncobrable'
		return this.DtoService.Post(url, cambioDTO);
	};

	pasarItemPrefacturaADevuelto(cambioDTO) {
		var url = 'CambioEstadoLoteItemPrefacturado/PasarItemPrefacturaADevuelto'
		return this.DtoService.Post(url, cambioDTO);
	};
	generarCierrePorUsuario(idUsuario,fechaDesde, fechaHasta, idServicio, idSucursal, obrasSociales, particulares) {
		var url = 'CierreRecepcion/GenerarCierres/'+idUsuario+'/'+fechaDesde+'/'+fechaHasta+'/'+idServicio+'/'+idSucursal+'/'+obrasSociales+'/'+particulares
		return this.DtoService.Post(url,{});
	};
	generarCierrePorUsuarioParaControl(idUsuario,fechaDesde, fechaHasta, idServicio, idSucursal,  obrasSociales, particulares) {
		var url = 'CierreRecepcion/GenerarCierresParaControl/'+idUsuario+'/'+fechaDesde+'/'+fechaHasta+'/'+idServicio+'/'+idSucursal+'/'+obrasSociales+'/'+particulares
		return this.DtoService.Post(url,{});
	};

	eliminarCierreRecepcion(id) {
		var url = 'CierreRecepcion/Eliminar/'+id
		return this.DtoService.Get(url);
	};

	exportarCierresExcel(cierre) {
		var url = 'CierreRecepcion/ExportListaCierresAExcel/'
		return this.DtoService.DownloadFileDto(url,"CierresDeRecepcion.xlsx",cierre)
	};

	exportarItemsCierreExcel(idCierre){
		let url = 'CierreRecepcion/ExportListaItemsCierresAExcel/'+idCierre;
		return this.DtoService.DownloadFile(url, 'LitaDeItemsDeCierreRecepcion.xlsx');
	};

	obtenerCierresPorIdsParaImpresion(listaIdsCierres) {
		var url = 'CierreRecepcion/ObtenerPorIdsParaImpresion';
		return this.DtoService.Post(url,listaIdsCierres)
	};
	
	obtenerDefinitivosPorIdsParaImpresion(listaIdsDefinitivos){
		var url = 'Definitivo/ObtenerPorIdsParaImpresion';
		return this.DtoService.Post(url,listaIdsDefinitivos)
	};

	obtenerLotesPorIdsParaImpresion(listaIdsLotes) {
		var url = 'Lotes/ObtenerPorIdsParaImpresion';
		return this.DtoService.Post(url,listaIdsLotes)
	};

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class CierreRecepcionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('CierreRecepcionDataService', dataService.serviceFactory())
	}
}	
