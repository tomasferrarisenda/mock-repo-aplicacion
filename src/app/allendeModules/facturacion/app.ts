/**
* @author:         emansilla
* @description:    Facturacion
* @type:           Module
**/

import * as angular from 'angular';
import "./config/app";
import "./common/app";
import "./prefactura/app";
import "./autorizador/app";
import "./configuraciones/app";
import "./cierreRecepcion/app";
import "./definitivos/app";
import "./lote/app";
import "./itemsPrefacturadosParaLotes/app";
import "./itemsPrefacturadosPendientes/app";
import "./loteRecepcionPorFiltro/app";
import "./buscadorDinamicoUsuario/app";


// Se crea y exporta el módulo
export const FacturacionModule = angular.module('facturacion', [
	'facturacion.config',
	'facturacion.common',
	'facturacion.prefactura',
	'facturacion.autorizador',
	'facturacion.configuraciones',
	'facturacion.cierreRecepcionList',
	'facturacion.definitivosList',
	'facturacion.loteList',
	'facturacion.itemsPrefacturadosParaLotes',
	'facturacion.itemsPrefacturadosPendientes',
	'facturacion.loteslistview',
	'facturacion.buscadorDinamicoUsuario'
]);

// Run
FacturacionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Facturacion');
	$log.debug('ON.-');
}