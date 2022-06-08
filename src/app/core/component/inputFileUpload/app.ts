/**
 * @author:			Jorge Basiluk Y Pablo Pautasso
 * @description:	Directiva para input file upload
 * @type:			Module
 **/
'use strict';
import * as angular from 'angular';
import fwFileUpload from './fwFileUpload';

(function () {
	'use strict';
	/* Core.Component.Image Module */
	const ngModule = angular.module('core.component.fileUpload',[]);
	
	fwFileUpload.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.FileUpload');
		$log.debug('ON.-');
	}
})();