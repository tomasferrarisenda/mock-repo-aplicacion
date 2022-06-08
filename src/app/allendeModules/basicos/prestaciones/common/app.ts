/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import saPrestacionList from '../common/directives/saPrestacionList';
import saGrupoPrestacionList from '../common/directives/saGrupoPrestacionList'
import saPrestacionMultipleSelector from '../common/directives/saPrestacionMultipleSelector';
import saPrestacionSelector from '../common/directives/saPrestacionSelector';



(function () {
	/* Basicos.Config Module */
	const module = angular.module('prestaciones.common', []);

	saPrestacionList.init(module);
	saPrestacionMultipleSelector.init(module);
	saPrestacionSelector.init(module);
	saGrupoPrestacionList.init(module);

    
	module.run(['Logger', function ($log) {
		$log = $log.getInstance("Prestaciones.Common");
		$log.debug('ON.-');
	}]);
})();


