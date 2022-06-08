/**
* @author:         ppautasso
* @description:    App para Repo de front home
* @type:           Module
**/
import * as angular from 'angular';
import { RepoFrontHomeStates } from './states';

export const RepoFrontConfigModule = angular.module('repofront.config', []);

RepoFrontConfigModule.run(runMethod);
RepoFrontHomeStates.init(RepoFrontConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('RepoFront.Config');
	$log.debug('ON.-');
}