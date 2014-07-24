var tablaMov = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/tableMov/tableMovimientos.html',
		controller: function (){

		},
		controllerAs: 'tablaMovCtr'
	};
};

appDirectives.directive('tablaMovimientos', tablaMov);