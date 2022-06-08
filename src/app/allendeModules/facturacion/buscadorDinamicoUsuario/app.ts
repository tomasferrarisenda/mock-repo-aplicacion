/**
* @author: rbassi
* @description: buscador Dinamico de Usuario
* @type: Module
**/
import * as angular from 'angular';
import {buscadorDinamicoUsuarioComponent} from './components/buscadorDinamicoUsuarioComponent'
import {buscadorDinamicoUsuarioDataService} from './services/buscadorDinamicoUsuarioDataService'


const config: fw.IConfig[] = [
];

const components: fw.IComponent[] = [
	buscadorDinamicoUsuarioComponent
];

const services: fw.IService[] = [
	buscadorDinamicoUsuarioDataService
];

// Se crea y exporta el módulo
export const buscadorDinamicoUsuarioModule = angular.module('facturacion.buscadorDinamicoUsuario',[]);

config.forEach(c => c.init(buscadorDinamicoUsuarioModule))
components.forEach(c => c.init(buscadorDinamicoUsuarioModule));
services.forEach(s => s.init(buscadorDinamicoUsuarioModule));

// Run
buscadorDinamicoUsuarioModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.buscadorDinamicoUsuario');
 $log.debug('ON.-');
}

