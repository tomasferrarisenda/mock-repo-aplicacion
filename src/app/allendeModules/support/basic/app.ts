/**
* @author:         emansilla
* @description:    Elementos basicos de soporte
* @type:           Module
**/
import * as angular from 'angular';
import SupportLogicService from "./services/SupportLogicService";
import BuscadorPacienteController from "./controllers/BuscadorPacienteController";
import ListSelectorBaseController from "./controllers/ListSelectorBaseController";
import SucursalSelectorController from "./controllers/SucursalSelectorController";
import SucursalOptionalSelectorController from "./controllers/SucursalOptionalSelectorController";
import saSelectorPaciente from "./directives/saSelectorPaciente";
import saNewSelectorRecurso from "./directives/saNewSelectorRecurso";
import SearchPrefacturablesController from "./controllers/SearchPrefacturablesController";
import SearchProfesionalSolicitanteController from "./controllers/SearchProfesionalSolicitanteController";
import saProfesionalSolicitanteSelector from "./directives/saProfesionalSolicitanteSelector";
import saPrefacturableSelector from "./directives/saPrefacturableSelector";
import EditarPrefacturableController from "./controllers/EditarPrefacturableController";
import SearchInternadosController from "./controllers/SearchInternadosController";
import SearchPracticasController from "./controllers/SearchPracticasController";
import SearchProfesionalController from "./controllers/SearchProfesionalController";
import saProfesionalSelector from "./directives/saProfesionalSelector";
import { SupportDataService, SucursalDataService, RecursoDataService, TipoSexoDataService, AmbitoDataService, PisoDelEdificioDataService, SectorDeInternacionDataService} from './services';

const services: fw.IService[] = [
	AmbitoDataService,
	SupportDataService,
	SupportLogicService,
	SucursalDataService,
	RecursoDataService,
	TipoSexoDataService,
	PisoDelEdificioDataService,
	SectorDeInternacionDataService
];

const controllers: fw.IController[] = [
	BuscadorPacienteController,
	SucursalSelectorController,
	ListSelectorBaseController,
	SucursalOptionalSelectorController,
	saSelectorPaciente,
	saNewSelectorRecurso,
	EditarPrefacturableController,
	SearchPrefacturablesController,
	SearchProfesionalSolicitanteController,
	saProfesionalSolicitanteSelector,
	saPrefacturableSelector,
	SearchInternadosController,
	SearchPracticasController,
	SearchProfesionalController,
	saProfesionalSelector
];

export const AllendeSupportBasicModule = angular.module('allende.support.basic', []);

services.forEach(s => s.init(AllendeSupportBasicModule));
controllers.forEach(c => c.init(AllendeSupportBasicModule));

AllendeSupportBasicModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Allende.Support.Basic');
	$log.debug('ON.-');
}


	




