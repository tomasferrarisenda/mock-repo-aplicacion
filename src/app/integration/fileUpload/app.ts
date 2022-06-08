/**
 * @author 			jbasiluk
 * @description 	Angular file uploader
 */
import * as angular from 'angular';
import 'ng-file-upload';

(function () {
	'use strict';
	/* CIntegration.re.CheckBox Modules */
	const module = angular.module('integration.fileUpload', [
		'ngFileUpload'
		]);

	module.run(['Logger', function ($log) {
		$log = $log.getInstance('Integration.FileUpload');
		$log.debug('ON.-');
	}]);
})();