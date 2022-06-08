/**
* @author:         emansilla
* @description:    Cuentas
* @type:           Module
**/
import * as angular from 'angular';
import { FacturacionCuentasStates } from './config';
import { FacturacionCuentaListComponent, FacturacionCuentaEditComponent} from './components';
import { CuentaDataService, CuentaLogicService } from './services';

const config: fw.IConfig[] = [
	FacturacionCuentasStates
];

const components: fw.IComponent[] = [
	FacturacionCuentaListComponent,
	FacturacionCuentaEditComponent
];

const services: fw.IService[] = [
	CuentaDataService,
	CuentaLogicService
];

export const FacturacionCuentaModule = angular.module('facturacion.configuraciones.cuentas', []);

config.forEach(c => c.init(FacturacionCuentaModule));
components.forEach(c => c.init(FacturacionCuentaModule));
services.forEach(s => s.init(FacturacionCuentaModule));

// Run
FacturacionCuentaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Facturacion.Configuraciones.Cuentas');
	$log.debug('ON.-');
}