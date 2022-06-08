/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import fwWorkSpinnerDirective from "./directives/fwWorkSpinnerDirective";
import fwWorkSpinnerNotDirective from "./directives/fwWorkSpinnerNotDirective";
import HttpDictionary from "./services/HttpDictionary";
import HttpException from "./services/HttpException";
import HttpRequestCounter from "./services/HttpRequestCounter";
import HttpToken from "./services/HttpToken";
import HttpStatusCodeHandler from "./services/HttpStatusCodeHandler";
import DtoService from "./services/DtoService";
import FormEncode from "./services/FormEncode";
import "./config/app";

(function () {
	'use strict';
	/* Core.Http Module */
	const ngModule = angular.module('core.http', ['core.http.config']);

	fwWorkSpinnerDirective.init(ngModule);
	fwWorkSpinnerNotDirective.init(ngModule);
	
	HttpDictionary.init(ngModule);
	HttpException.init(ngModule);
	HttpRequestCounter.init(ngModule);
	HttpToken.init(ngModule);
	HttpStatusCodeHandler.init(ngModule);

	DtoService.init(ngModule);
	FormEncode.init(ngModule);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Core.Http');
		$log.debug('ON.-');
	}]);

})();