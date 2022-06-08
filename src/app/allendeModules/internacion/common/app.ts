/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import states from "./config/states";
import permissions from "./config/permissions";
import InternacionAboutController from "./controllers/InternacionAboutController";
import ProtesisEditController from "./controllers/ProtesisEditController";
import ProtesisStateSelectorController from "./controllers/ProtesisStateSelectorController";
import ProtesisObservacionesModalController from "./controllers/ProtesisObservacionesModalController";
import TipoAltaInternacionSelectorController from "./controllers/TipoAltaInternacionSelectorController";

import InternacionCommonLogicService from "./services/InternacionCommonLogicService";
import InternacionCommonDataService from "./services/InternacionCommonDataService";
import ProtesisDataService from "./services/ProtesisDataService";
import ProtesisLogicService from "./services/ProtesisLogicService";
import IntervencionDataService from "./services/IntervencionDataService";
import IntervencionLogicService from "./services/IntervencionLogicService";

import saInternadoIntervencion from "./directives/saInternadoIntervencion";

import {BuscadorInternadoPorSectorComponent,SelectorInternadoComponent,BuscadorInternadoModalComponent,InformacionInternadoModalComponent } from './components';
import {InternacionesDataService} from './services';

import saProcedimientosIntervencion from "./directives/saProcedimientosIntervencion";
import saProtesisIntervencion from "./directives/saProtesisIntervencion";
import saPrequirurgicosInternacion from "./directives/saPrequirurgicosInternacion";
import saCantidadDiasInternacion from "./directives/saCantidadDiasInternacion";
import saAfiliacionInternado from "./directives/saAfiliacionInternado";
import saObservacionesInternado from "./directives/saObservacionesInternado";

import saTabInternadoObservaciones from "./directives/saTabInternadoObservaciones";
(function () {
	'use strict';
	/* Internacion.Common Module */
	const module = angular.module('internacion.common', []);

	states.init(module);
	permissions.init(module);
	
	InternacionAboutController.init(module);
	ProtesisEditController.init(module);
	ProtesisStateSelectorController.init(module);
	ProtesisObservacionesModalController.init(module);
	
	TipoAltaInternacionSelectorController.init(module);

	InternacionCommonLogicService.init(module);
	InternacionCommonDataService.init(module);
	
	ProtesisDataService.init(module);
	ProtesisLogicService.init(module);
	InternacionesDataService.init(module);

	IntervencionDataService.init(module);
	IntervencionLogicService.init(module);

	saInternadoIntervencion.init(module);

	// components
	BuscadorInternadoPorSectorComponent.init(module);
	SelectorInternadoComponent.init(module);
	BuscadorInternadoModalComponent.init(module);
	InformacionInternadoModalComponent.init(module),

	saProcedimientosIntervencion.init(module);
	saProtesisIntervencion.init(module);
	saPrequirurgicosInternacion.init(module);
	saCantidadDiasInternacion.init(module);
	saAfiliacionInternado.init(module);
	saObservacionesInternado.init(module);

	saTabInternadoObservaciones.init(module);
	
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance("Internacion.Common");
		$log.debug('ON.-');
	}
})();