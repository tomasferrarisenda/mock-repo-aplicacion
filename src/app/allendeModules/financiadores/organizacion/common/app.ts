/**
 * @author 			Aldo Minoldo
 * @description 	description
 */

import * as angular from 'angular';

//import saNewMutualSelector from "./directives/saOrganizacionSelector";
import OrganizacionDataService from "./services/OrganizacionDataService";
import {OrganizacionLogicService} from "./services/OrganizacionLogicService";
import { OrganizacionSelectorComponent } from "./component/OrganizacionSelector/OrganizacionSelectorComponent/OrganizacionSelectorComponent";



(function(){
	'use strict';
	const module = angular.module('financiadores.organizacion.common',[]);
	//saNewMutualSelector.init(module);
	OrganizacionDataService.init(module);
	OrganizacionLogicService.init(module);
	OrganizacionSelectorComponent.init(module);
	
	
	module.run(run); 
	run.$inject = ['Logger'];

	function run ($log){
		$log = $log.getInstance('Organizacion.Common');
		$log.debug('ON.-');
	}
	})();