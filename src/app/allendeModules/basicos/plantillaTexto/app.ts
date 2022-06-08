/**
* @author: aminoldo
* @description: Plantilla de Texto
* @type: Module
**/
import * as angular from 'angular';
import { BasicosPlantillaTextoStates } from './config';
import { PlantillaTextoListComponent } from './components/plantillaTextoList/PlantillaTextoListComponent';
import { PlantillaTextoDataService, PlantillaTextoLogicService } from './services';
import { PlantillaTextoEditComponent} from './components/plantillaTextoEdit/PlantillaTextoEditComponent';

const config: fw.IConfig[] = [
    BasicosPlantillaTextoStates
];

const components: fw.IComponent[] = [
    PlantillaTextoListComponent,
    PlantillaTextoEditComponent
];

const services: fw.IService[] = [
    PlantillaTextoDataService,
    PlantillaTextoLogicService

];

// Se crea y exporta el módulo
export const BasicosPlantillaTextoModule = angular.module('basicos.plantillaTexto', []);

config.forEach(c => c.init(BasicosPlantillaTextoModule));
components.forEach(c => c.init(BasicosPlantillaTextoModule));
services.forEach(s => s.init(BasicosPlantillaTextoModule));

// Run
BasicosPlantillaTextoModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
    $log = $log.getInstance('Basicos.PlantillaTexto');
    $log.debug('ON.-');
}