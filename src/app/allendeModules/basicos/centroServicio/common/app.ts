/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';

import saTableCentroServiciosComponent from './components/saTableCentroServicios/saTableCentroServiciosComponent';
import saTablaConActivoMasVisiblePortalWeb from './components/saTableCentroServicios/saTablaConActivoMasVisiblePortalWebComponent';
import {ServiciosEnSucursalTableComponent,RecursosEnServicioEnSucursalTableComponent,
	PrestacionesEnServicioEnSucursalTableComponent,PrestacionesDelRecursoEnServicioEnSucursalTableComponent,
	GrupoPrestacionesEnServicioEnSucursalTableComponent,RecursosPorPrestacionEnServicioEnSucursalTableComponent, 
	GrupoPrestacionesDelRecursoEnServicioEnSucursalTableComponent} from './components'

(function () {
	/* Servicios.Common Module */
	const module = angular.module('centroServicios.common', []);

	module.run(run);

	//component
	saTableCentroServiciosComponent.init(module);
	saTablaConActivoMasVisiblePortalWeb.init(module);
	ServiciosEnSucursalTableComponent.init(module);
	RecursosEnServicioEnSucursalTableComponent.init(module);
	PrestacionesEnServicioEnSucursalTableComponent.init(module);
	PrestacionesDelRecursoEnServicioEnSucursalTableComponent.init(module);
	GrupoPrestacionesEnServicioEnSucursalTableComponent.init(module);
	RecursosPorPrestacionEnServicioEnSucursalTableComponent.init(module);
	GrupoPrestacionesDelRecursoEnServicioEnSucursalTableComponent.init(module);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("CentroServicios.Common");
		$log.debug('ON.-');
	}
})();