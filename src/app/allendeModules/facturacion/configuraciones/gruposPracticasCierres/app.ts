/**
* @author: rbassi
* @description: Grupos de Practicas Para cierre
* @type: Module
**/
import * as angular from 'angular';
import {gruposPracticasCierresStates} from './config';
import {gruposPracticasCierresListComponent} from './components/gruposPracticasCierresList';
import {gruposPracticasCierresEditComponent} from './components/gruposPracticasCierresEdit';
import {GruposPracticasCierresDataService, GruposPracticasCierresLogicService} from './services';


const config: fw.IConfig[] = [
    gruposPracticasCierresStates
];


const components: fw.IComponent[] = [
    gruposPracticasCierresListComponent,
    gruposPracticasCierresEditComponent
];

const services: fw.IService[] = [
    GruposPracticasCierresDataService,
    GruposPracticasCierresLogicService
];

// Se crea y exporta el módulo
export const FacturasGruposPracticasCierresModule = angular.module('facturacion.configuraciones.grupoPracticasParaCierre',[]);


config.forEach(c => c.init(FacturasGruposPracticasCierresModule));
components.forEach(c => c.init(FacturasGruposPracticasCierresModule));
services.forEach(s => s.init(FacturasGruposPracticasCierresModule));

// Run
FacturasGruposPracticasCierresModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.configuraciones.grupoPracticasParaCierre');
 $log.debug('ON.-');
}
