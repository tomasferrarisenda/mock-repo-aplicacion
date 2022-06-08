/**
 * @author:			Ezequiel Mansilla
 * @description:	Componentes comunes de cama
 * @type:			Module
 **/
import * as angular from 'angular';
import saTipoHabitacionFisicaSelectorMultipleDirective from "./directives/saTipoHabitacionFisicaSelectorMultipleDirective";
import {PisoSectorContenedorComponent ,PisoSelectorComponent, SectorSelectorComponent, DepositoSelectorComponent} from './components';

export default (function () {
	/* Cama.Common Module */
	const module = angular.module('cama.common',[]);

	saTipoHabitacionFisicaSelectorMultipleDirective.init(module);
	PisoSectorContenedorComponent.init(module);
	PisoSelectorComponent.init(module);
	SectorSelectorComponent.init(module);
	DepositoSelectorComponent.init(module);
	module.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Cama.Common');
		$log.debug('ON.-');
	}
})();