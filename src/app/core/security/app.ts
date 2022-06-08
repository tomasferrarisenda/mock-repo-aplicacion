/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import constants from "./config/constants";
import states from "./config/states";
import AuthenticationController from "./controllers/AuthenticationController";
import AuthenticationMedicoController from "./controllers/AuthenticationMedicoController";
import AuthenticationUsuarioController from "./controllers/AuthenticationUsuarioController";
import AuthenticationModalController from "./controllers/AuthenticationModalController";
import ActionListSelectorController from "./controllers/ActionListSelectorController";
import ChangePasswordController from "./controllers/ChangePasswordController";
import ValidarUsuarioModalController from "./controllers/ValidarUsuarioModalController";

import saFormLogin from "./directives/saFormLogin";
import { LoginOkComponent } from './components';

import AuthorizationService from "./services/AuthorizationService";
import SecurityLogicService from "./services/SecurityLogicService";
import SecurityDataService from "./services/SecurityDataService";
import {CredentialsDataService} from "./services/CredentialsDataService";
import UserInfoDataService from "./services/UserInfoDataService";
//import CurrentUser from "./services/CurrentUser";
import Base64 from "./services/Base64";

(function () {
	'use strict';
	/* Core.Security Module */
	const ngModule = angular.module('core.security',[]);

	constants.init(ngModule);
	states.init(ngModule);
	
	Base64.init(ngModule);
	AuthorizationService.init(ngModule);
	SecurityLogicService.init(ngModule);
	SecurityDataService.init(ngModule);
	CredentialsDataService.init(ngModule);
	UserInfoDataService.init(ngModule);
	//CurrentUser.init(ngModule);

	saFormLogin.init(ngModule);

	LoginOkComponent.init(ngModule);

	AuthenticationController.init(ngModule);
	AuthenticationMedicoController.init(ngModule);
	AuthenticationUsuarioController.init(ngModule);
	AuthenticationModalController.init(ngModule);
	ActionListSelectorController.init(ngModule);
	ChangePasswordController.init(ngModule);
	ValidarUsuarioModalController.init(ngModule);

	ngModule.run(['Logger',function ($log) {
		$log = $log.getInstance('Core.Security');
		$log.debug('ON.-');
	}]);

})();