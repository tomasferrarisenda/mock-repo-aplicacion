/**
* @author: emansilla
* @description: Compilación en linea de HTML
* @type: Directive
**/
import * as angular from 'angular';

class Directive implements angular.IDirective {
	restrict = 'A';
	replace = true;
	scope = {
		dynamic: '=dynamic'
	};

	constructor(private $log, private $compile) { }

	public link(scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
		this.$log.debug('fwDynamicHtml linked');
		scope.$watch('dynamic', (html: any) => {
			element.html(html);
			this.$compile(element.contents())(scope);
		});
	}

	static directiveFactory(): angular.IDirectiveFactory {
		const directive = ($log: angular.ILogService, $compile: angular.ICompileService) => new Directive($log, $compile);
		directive.$inject = ['$log', '$compile'];
		return directive;
	}
}

export class DynamicHtml {
	static init(ngModule: angular.IModule) {
		ngModule.directive('saDynamicHtml', Directive.directiveFactory());
	}
}