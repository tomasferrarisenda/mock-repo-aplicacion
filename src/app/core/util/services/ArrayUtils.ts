/**
 * @author:			Emansilla
 * @description:	Interface para array utils
 * @type:			Service
 **/

function _dynamicSortMultiple(...props: any[]) {
	/*
	* save the arguments object as it will be overwritten
	* note that arguments object is an array-like object
	* consisting of the names of the properties to sort by
	*/
	// var props = arguments;
	return function (obj1, obj2) {
		var i = 0, result = 0, numberOfProperties = props.length;
		/* try getting a different result from 0 (equal)
		* as long as we have extra properties to compare
		*/
		while(result === 0 && i < numberOfProperties) {
			result = _dynamicSort(props[i])(obj1, obj2);
			i++;
		}
		return result;
	}
}

function _dynamicSort(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

Object.defineProperty(Array.prototype, "sortBy", {
	enumerable: false,
	writable: true,
	value: function(...props: any[]) {
		return this.sort(_dynamicSortMultiple.apply(null, props));
	}
});

export default (function () {
	'use strict';

	// if (!Array.prototype.firstOrDefault) {
	// Array.prototype.firstOrDefault = function (predicate: (item: any) => boolean) {
	// 	for (var i = 0; i < (<Array<any>>this).length; i++) {
	// 		let item = (<Array<any>>this)[i];
	// 		if (predicate(item)) {
	// 			return item;
	// 		}
	// 	}
	// 	return null;
	// }
	// }

	// // if(!Array.prototype.unique){
	// // Array.prototype.unique = function(a) {
	// // 			return function() {
	// // 				return this.filter(a)
	// // 			};
	// // 		}(function(a, b, c) {
	// // 			return c.indexOf(a, b + 1) < 0
	// // 		});
	// // }

	// // if (!Array.prototype.where) {
	// // Array.prototype.where = function (predicate: (item: any) => boolean) {
	// // 	let result = [];
	// // 	for (var i = 0; i < (<Array<any>>this).length; i++) {
	// // 		let item = (<Array<any>>this)[i];
	// // 		if (predicate(item)) {
	// // 			result.push(item);
	// // 		}
	// // 	}
	// // 	return result;
	// // }
	// // }

	// if (!Array.prototype.remove) {
	// Array.prototype.remove = function (item: any): boolean {
	// 	let index = (<Array<any>>this).indexOf(item);
	// 	if (index >= 0) {
	// 		(<Array<any>>this).splice(index, 1);
	// 		return true;
	// 	}
	// 	return false;
	// }
	// }

	// if (!Array.prototype.removeRange) {
	// Array.prototype.removeRange = function (items: any[]): void {
	// 	for (var i = 0; i < items.length; i++) {
	// 		(<Array<any>>this).remove(items[i]);
	// 	}
	// }
	// }

	// if (!Array.prototype.add) {
	// Array.prototype.add = function (item: any): void {
	// 	(<Array<any>>this).push(item);
	// }
	// }

	// if (!Array.prototype.addRange) {
	// Array.prototype.addRange = function (items: any[]): void {
	// 	for (var i = 0; i < items.length; i++) {
	// 		(<Array<any>>this).push(items[i]);
	// 	}
	// }
	// }

	// if (!Array.prototype.orderBy) {
	// Array.prototype.orderBy = function (propertyExpression: (item: any) => any) {
	// 	let result = [];
	// 	var compareFunction = (item1: any, item2: any): number => {
	// 		if (propertyExpression(item1) > propertyExpression(item2)) return 1;
	// 		if (propertyExpression(item2) > propertyExpression(item1)) return -1;
	// 		return 0;
	// 	}
	// 	for (var i = 0; i < (<Array<any>>this).length; i++) {
	// 		return (<Array<any>>this).sort(compareFunction);

	// 	}
	// 	return result;
	// }
	// }

	// if (!Array.prototype.orderByDescending) {
	// Array.prototype.orderByDescending = function (propertyExpression: (item: any) => any) {
	// 	let result = [];
	// 	var compareFunction = (item1: any, item2: any): number => {
	// 		if (propertyExpression(item1) > propertyExpression(item2)) return -1;
	// 		if (propertyExpression(item2) > propertyExpression(item1)) return 1;
	// 		return 0;
	// 	}
	// 	for (var i = 0; i < (<Array<any>>this).length; i++) {
	// 		return (<Array<any>>this).sort(compareFunction);
	// 	}
	// 	return result;
	// }
	// }

	// if (!Array.prototype.orderByMany) {
	// Array.prototype.orderByMany = function (propertyExpressions: [(item: any) => any]) {
	// 	let result = [];
	// 	var compareFunction = (item1: any, item2: any): number => {
	// 		for (var i = 0; i < propertyExpressions.length; i++) {
	// 			let propertyExpression = propertyExpressions[i];
	// 			if (propertyExpression(item1) > propertyExpression(item2)) return 1;
	// 			if (propertyExpression(item2) > propertyExpression(item1)) return -1;
	// 		}
	// 		return 0;
	// 	}
	// 	for (var i = 0; i < (<Array<any>>this).length; i++) {
	// 		return (<Array<any>>this).sort(compareFunction);
	// 	}
	// 	return result;
	// }
	// }

	// if (!Array.prototype.orderByManyDescending) {
	//  Array.prototype.orderByManyDescending = function (propertyExpressions: [(item: any) => any]) {
	// 	let result = [];
	// 	var compareFunction = (item1: any, item2: any): number => {
	// 		for (var i = 0; i < propertyExpressions.length; i++) {
	// 			let propertyExpression = propertyExpressions[i];
	// 			if (propertyExpression(item1) > propertyExpression(item2)) return -1;
	// 			if (propertyExpression(item2) > propertyExpression(item1)) return 1;
	// 		}
	// 		return 0;
	// 	}
	// 	for (var i = 0; i < (<Array<any>>this).length; i++) {
	// 		return (<Array<any>>this).sort(compareFunction);
	// 	}
	// 	return result;
	// }
	// }

})();

// export default class {
// 	public static init(ngModule: angular.IModule) {
// 		ngModule.factory('ArrayUtils', ArrayUtils);
// 	}
// }