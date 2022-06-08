/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { AllendeSupportConfigModule } from './config';
import { AllendeSupportBasicModule } from './basic';
import { AllendeSupportCuestionarioModule } from './cuestionario';
import { AllendeSupportDomicilioModule } from './domicilio';
import { AllendeSupportTelefonoModule } from './telefono';
import { AllendeSupportEmpresaModule } from './empresa';
// import { TestModule } from './test'; // dejar comentado
import { AllendeSupportNacionalidadModule } from './nacionalidad';
import { AllendeSupportTelefonosModule } from './telefonos/app';

const modules = [
	AllendeSupportConfigModule,
	AllendeSupportBasicModule,
	AllendeSupportCuestionarioModule,
	AllendeSupportDomicilioModule,
	AllendeSupportTelefonoModule,
	AllendeSupportEmpresaModule,
	AllendeSupportNacionalidadModule,
	AllendeSupportTelefonosModule,
	// TestModule
];

export const AllendeSupportModule = angular.module('allende.support', modules.map(m => m.name));

AllendeSupportModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log) {
	$log = $log.getInstance('Support');
	$log.debug('ON.-');
}