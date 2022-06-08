import { FiltroOrganizacionDto } from "../model";

/**
 * @author:			Aldo Minoldo
 * @description:	Servicio de datos de organizacion
 * @type:			Service
 **/
export interface IOrganizacionDataService {
	GetByCodigo(codigo : number): any,
	CrearFiltroOrganizacion():angular.IPromise<FiltroOrganizacionDto>,
	ObtenerPorFiltro(filtroDto:FiltroOrganizacionDto):angular.IPromise<any>,
	getAllOrganizacionParaBusqueda() : angular.IPromise<any>
}

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('OrganizacionDataService', OrganizacionDataService);

		OrganizacionDataService.$inject = ['DotService']
		
		function OrganizacionDataService (DotService) {

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			const service = {
				CrearFiltroOrganizacion : CrearFiltroOrganizacion,
				getAllOrganizacionParaBusqueda : getAllOrganizacionParaBusqueda,
				ObtenerPorFiltro : ObtenerPorFiltro,
				getAllOrganizacionOrg: getAllOrganizacionOrg,
				GetByCodigo : GetByCodigo
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			function CrearFiltroOrganizacion() {
				var _url = 'Organizacion/CrearFiltroOrganizacion';
				return DotService.Get(_url);
			}

			function getAllOrganizacionOrg() {
				var _url = 'Organizacion/ObtenerTodosParaVista';
				return DotService.Get(_url);
			}

			function ObtenerPorFiltro(filtroDto) {
				var _url = 'Organizacion/ObtenerPorFiltro';
				return DotService.Post(_url, filtroDto);
			}

			function getAllOrganizacionParaBusqueda() {
				var _url = 'Organizacion/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function GetByCodigo(codigo: number) {
				var _url = 'Organizacion/GetByCodigo/'+codigo;
				return DotService.Get(_url);
			}
			return service;
		}
	};

	return module;
})();