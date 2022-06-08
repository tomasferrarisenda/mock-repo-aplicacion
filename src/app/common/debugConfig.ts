/**
 * @author 			emansilla
 * @description 	description
 */

export class DebugConfig {
	static $inject : Array<string> = ['$compileProvider', 'DEBUG'];
	/**
	 *
	 */
	constructor($compileProvider: angular.ICompileProvider, DEBUG: boolean) {
		$compileProvider.debugInfoEnabled(DEBUG);
	}
}