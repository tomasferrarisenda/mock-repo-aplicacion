/**
* @author:         ppautasso
* @description:    Modulo de farmacia
* @type:           Module
**/
import * as angular from 'angular';
import {RepoFrontConfigModule}  from './config';

import {RepoElementosFrontEndContenedorComponent, RepoFrontBotonesComponent,RepoFrontInputsComponent, RepoFrontModalesComponent, 
	RepoFrontColoresClasesComponent,RepoFrontAlertasComponent,RepoFrontFormulariosBasicosComponent,RepoFrontIconosComponent,RepoModalBarCodeComponent} from './components';

import {RepoFrontLogicService} from './services'


const modules = [
	RepoFrontConfigModule
];

export const RepoFrontModule = angular.module('repoFront', modules.map(m => m.name))

// Components
RepoElementosFrontEndContenedorComponent.init(RepoFrontModule);
RepoFrontBotonesComponent.init(RepoFrontConfigModule);
RepoFrontInputsComponent.init(RepoFrontModule);
RepoFrontModalesComponent.init(RepoFrontModule);
RepoFrontColoresClasesComponent.init(RepoFrontModule);
RepoFrontAlertasComponent.init(RepoFrontModule);
RepoFrontFormulariosBasicosComponent.init(RepoFrontModule);
RepoFrontIconosComponent.init(RepoFrontModule);
RepoModalBarCodeComponent.init(RepoFrontModule);

// Services
RepoFrontLogicService.init(RepoFrontModule);

// Run
RepoFrontModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('RepoFront');
	$log.debug('ON.-');
}
