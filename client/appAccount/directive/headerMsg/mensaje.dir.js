////////////////
// DIRECTIVAS //
////////////////

//encabezado de vistas, adicion de mensaje personalizado
var mensaje = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/headerMsg/headerMessage.html',
		replace: true,
		transclude: true
	};
};

var appDirectives = window.angular.module('util-directives', []);
appDirectives.directive('mensaje', mensaje);
