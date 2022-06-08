/**
* @author:         emansilla
* @description:    Data de movimientos stock
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IMovimientoStockDataService {
	getInternacionesPorMovimientoRepuesto(idMovimiento);
	getMovimeintosDetalleByMovimientoRepuestoAndInternacion(idMovimiento, idInternacion);
	getMaterialesPorMovimiento(idMovimiento);
	addMovimiento(movimiento);
	getMovimientoDetallePorMovimiento(idMovimiento);
	autorizarMovimiento(idMovimiento);
	getMovimientosPorProductoAndUbicacion(idUbicacion, idProducto);
	getMovimientosPorProductoAndUbicacionAndInternacion(idUbicacion, idProducto, idInternacion);
	reponerMovimiento(movimiento);
	getMovimientosByUbicacionDesde(idUbicacion);
	getMovimientosByUbicacionDesdeAndFechas(pObject);
	getMovimientoDetalleComprimidoPorMovimiento(idMovimiento);
	getExcelByDetalleMovimiento(idProducto);
	getMovimientoDetallesByUbicacionAndInternacion(idUbicacion, idInternacion);
	descartarMovimientoDetalle(idMovimientoDetalle);
	cancelarMovimiento(idMovimiento);
	cancelarDetalle(idDetalle);
	newDevolucion(movimiento);

	entregarCargados(movimiento);
	newDosificacion(dosificacion);
	getInternacionesPendientesBySucursal(idSucursal);
	newMovimientoVentanilla(movimiento);
	getPendientesByInternado(numeroInternado);
	newMovimientoQuirofano(movimiento);
	/**
	 * @deprecated No se encuentra en backend
	 */
	obtenerPendientesPorUbicacionYTipo(idUbicacion: number, tipo: number);
	obtenerListadoDosificacionPorMovimiento(idMovimiento: number);
	entregarRepoQuirofano(repo);
}

class dataService implements IMovimientoStockDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('MovimientoStockDateService');
		this.$log.debug('ON');
	}

	public getInternacionesPorMovimientoRepuesto(pMovimiento) {
		var _url = 'MovimientoStock/GetInternacionesPorMovimientoRepuesto/' + pMovimiento + '/';
		return this.DtoService.Get(_url);
	}

	public getMovimeintosDetalleByMovimientoRepuestoAndInternacion(pMovimiento, pInternacion) {
		var _url = 'MovimientoStock/GetMovimeintosDetalleByMovimientoRepuestoAndInternacion/' + pMovimiento + '/' + pInternacion;
		return this.DtoService.Get(_url);
	}
	public getMaterialesPorMovimiento(pMovimiento) {
		var _url = 'MovimientoStock/GetAllMaterialesByMovimiento/' + pMovimiento + '/';
		return this.DtoService.Get(_url);
	}

	public addMovimiento(pMovimiento) {
		var _url = 'MovimientoStock/Enfermeria/AddOne/';
		return this.DtoService.Post(_url, pMovimiento);
	}

	public getMovimientoDetallePorMovimiento(pMovimiento) {
		var _url = 'MovimientoStock/GetAllDetallesById/' + pMovimiento;
		return this.DtoService.Get(_url);
	}

	public autorizarMovimiento(pMovimiento) {
		var _url = 'MovimientoStock/AutorizarById/' + pMovimiento;
		return this.DtoService.Get(_url);
	}

	public getMovimientosPorProductoAndUbicacion(pUbicacion, pProducto) {
		var _url = 'MovimientoStock/GetNoRepuestosByIdUbicacionAndProducto/' + pUbicacion + '/' + pProducto;
		return this.DtoService.Get(_url);
	}

	public getMovimientosPorProductoAndUbicacionAndInternacion(pUbicacion, pProducto, pInternacion) {
		var _url = 'MovimientoStock/GetNoRepuestosByIdUbicacionAndProductoAndUbicacionInternacion/' +
			pUbicacion + '/' + pProducto + '/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public reponerMovimiento(pMovimiento) {
		var _url = 'MovimientoStock/Farmacia/AddOne/';
		return this.DtoService.Post(_url, pMovimiento);
	}

	// public reponerManyMovimientoDetalle(pMovimiento) {
	// 	var _url = 'MovimientoStock/ReponerManyDetalleMovimiento/';
	// 	return this.DtoService.Post( _url, pMovimiento);
	// }

	// public updateMovimiento(pMovimiento) {
	// 	var _url = 'MovimientoStock/Update/';
	// 	return this.DtoService.Post( _url, pMovimiento);
	// }

	public getMovimientosByUbicacionDesde(pUbicacion) {
		var _url = 'MovimientoStock/GetAllByIdUbicacionDesde/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getMovimientosByUbicacionDesdeAndFechas(pObject) {
		var _url = 'MovimientoStock/GetAllByUbicacionDesdeAndFechas/';
		return this.DtoService.Post(_url, pObject, {isDictionary: true});
	}

	public getMovimientoDetalleComprimidoPorMovimiento(pMovimiento) {
		var _url = 'MovimientoStock/GetAllDetalleComprimidoById/' + pMovimiento;
		return this.DtoService.Get(_url);
	}

	// public getDetalleMovimientoPadre (pDetalleMovimiento) {
	// 	var _url = 'MovimientoStock/GetMovimientoDetalleById/'+ pDetalleMovimiento;
	// 	return this.DtoService.Get( _url);
	// }

	public getExcelByDetalleMovimiento(pProducto) {
		var _url = 'MovimientoStock/GetListaExcelByIdDetalle/' + pProducto;
		return this.DtoService.Get(_url);
	}

	public getMovimientoDetallesByUbicacionAndInternacion(pUbicacion, pInternacion) {
		var _url = 'MovimientoStock/GetMovimientoDetalleByIdUbicacionAndIdUbicacionInternacion/' + pUbicacion + '/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public descartarMovimientoDetalle(pMovimientoDetalle) {
		var _url = 'MovimientoStock/DescartarMovimientoDetalleById/' + pMovimientoDetalle;
		return this.DtoService.Get(_url);
	}

	public cancelarMovimiento(pMovimiento) {
		var _url = 'MovimientoStock/CancelarMovimiento/' + pMovimiento;
		return this.DtoService.Get(_url);
	}

	public cancelarDetalle(pDetalle) {
		var _url = 'MovimientoStock/CancelarMovimientoDetalle/' + pDetalle;
		return this.DtoService.Get(_url);
	}

	public newDevolucion(pMovimiento) {
		var _url = 'MovimientoStock/FarmaciaVentanilla/NewDevolucion/';
		return this.DtoService.Post(_url, pMovimiento);
	}

	public entregarCargados(pMovimiento) {
		var _url = 'MovimientoStock/FarmaciaValidacion/EntregarCargados/';
		return this.DtoService.Post(_url, pMovimiento);
	}

	public newDosificacion(pDosificacion) {
		var _url = 'MovimientoStock/FarmaciaValidacion/AddDosificacion/';
		return this.DtoService.Post(_url, pDosificacion);
	}

	public getInternacionesPendientesBySucursal(pIdSucursal) {
		var _url = 'MovimientoStock/GetInternacionesPendientesBySucursal/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public newMovimientoVentanilla(pMovimiento) {
		var _url = 'MovimientoStock/FarmaciaVentanilla/NewMovimiento';
		return this.DtoService.Post(_url, pMovimiento);
	}

	public getPendientesByInternado(numeroInternado) {
		var _url = 'MovimientoStock/GetPendientesByInternado/' + numeroInternado;
		return this.DtoService.Get(_url);
	}

	public newMovimientoQuirofano(movimiento) {
		var _url = 'MovimientoStock/CargaQuirofano/';
		return this.DtoService.Post(_url, movimiento);
	}

	public obtenerPendientesPorUbicacionYTipo(idUbicacion: number, tipo: number) {
		var _url = 'MovimientoStock/ObtenerPendientesReposicionPorIdUbicacionYTipo/' + idUbicacion + '/' + tipo;
		return this.DtoService.Get(_url);
	}

	public entregarRepoQuirofano(repo) {
		var _url = 'MovimientoStock/CargaRepoQuirofano/';
		return this.DtoService.Post( _url, repo);
	}

	public obtenerListadoDosificacionPorMovimiento(idMovimiento: number) {
		var _url = 'MovimientoStock/ObtenerListadoDosificacionPorMovimiento/' + idMovimiento;
		return this.DtoService.Get(_url);
	}

	/**
	 * Creación de data service
	 * @static
	 * @param log 
	 * @param dtoService 
	 */
	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class MovimientoStockDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('MovimientoStockDataService', dataService.serviceFactory)
	}
}