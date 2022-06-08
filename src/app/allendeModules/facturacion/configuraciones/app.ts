import * as angular from 'angular';
import states from "./config/states";
import constants from "./config/constants";
import "./corteFacturacion/app";
import "./codigosNomenclador/app";
import "./listasFacturacion/app";
import "./cuentasDefectoDerechos/app";
import "./reglasSeleccionCtaDerecho/app";
import "./reglasAgrupacionParticipantes/app";
import { FacturacionCuentaModule } from './cuentas';
import { FacturacionUnidadesArancelariasModule } from './unidadesArancelarias';
import { FacturacionRequisitosAdministrativosModule } from './requisitosAdministrativos';
import { FacturasGruposPracticasCierresModule } from './gruposPracticasCierres';

(function () {
	/* Facturacion.Configuraciones.Common Module */
	const module = angular.module('facturacion.configuraciones', [
		'facturacion.configuraciones.codigosNomenclador',
		'facturacion.configuraciones.listaFacturacion',
		'facturacion.configuraciones.cuentasDefectoDerechos',
		'facturacion.configuraciones.corteFacturacion',
		'facturacion.configuraciones.reglaSeleccionCuentaDerecho',
		'facturacion.configuraciones.reglaAgrupacionParticipantes',
		FacturacionCuentaModule.name,
		FacturacionUnidadesArancelariasModule.name,
		FacturacionRequisitosAdministrativosModule.name,
		FacturasGruposPracticasCierresModule.name
	]);

	states.init(module);
	constants.init(module);
	module.run(run);

	run.$inject = ['Logger'];

	function run($log) { 
		$log = $log.getInstance("Facturacion.configuraciones");
	}
})();