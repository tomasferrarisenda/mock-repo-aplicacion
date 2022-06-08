/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
window['CKEDITOR_BASEPATH'] = '//cdn.ckeditor.com/4.7.3/full/';
// window['CKEDITOR_BASEPATH'] = '../node_modules/ckeditor/';
import 'ckeditor/ckeditor';
import 'angular-ckeditor/angular-ckeditor';
import './ck-editor.scss';

(function () {
	'use strict';
	
	/* Integration.TextEditor Modules */
	const ngModule = angular.module('integration.textEditor', ['ckeditor']);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Integration.TextEditor');
		$log.debug('ON.-');
	}]);

})();