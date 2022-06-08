/**
* @author:         emansilla
* @description:    Invierte color entre texto y background
* @type:           Directive
**/
import * as angular from 'angular';

class Directive implements angular.IDirective {
	restrict = 'A';
	// require = 'ngModel';
	// templateUrl = 'myDirective.html'; No se debe usar. Debería ser componente
	// replace = true;

	constructor(private $log, private $timeout) { }

	public link (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, ctrl: any) {
		this.$log.debug('saInvertColor linked');
		scope.invertIf = true;
		scope.hasInvert = false;

		scope.$watch(attrs.saInvertColor, (value) => {
			this.$log.debug('saInvertColor change ', value);
			scope.invertIf = (value === 'false' || value === false) ? false : true;
			this.handleChangeColor(element, scope);
		});

		// this.$timeout(() => {
		// 	this.$log.debug('saInvertColor init', scope.invertIf);
		// 	// this.$log.debug('saInvertColor backColor', $(element).css("background-color"));
		// 	// this.$log.debug('saInvertColor color', $(element).css("color"));
		// 	if (scope.invertIf) {
		// 		this.changeColor(element);
		// 	}
		// });
	}

	private handleChangeColor(element, scope) {
		if (scope.invertIf) {

			if (!scope.hasInvert) {
				this.changeColor(element);
				scope.hasInvert = true;
			}

		} else {
			if (scope.hasInvert) {
				this.changeColor(element);
				scope.hasInvert = false;
			}
		}
	}

	private changeColor(element) {
		let backColor = $(element).css("background-color");
		let textColor = $(element).css("color");
		element[0].style.backgroundColor = textColor;
		element[0].style.color = backColor;
	}


	static directiveFactory(): angular.IDirectiveFactory {
		const directive = ($log, $timeout) => new Directive($log, $timeout);
		directive.$inject = ['$log', '$timeout'];
		return directive;
	}
}

export class InvertColor {
	static init(ngModule: angular.IModule) {
		ngModule.directive('saInvertColor', Directive.directiveFactory());
	}
}