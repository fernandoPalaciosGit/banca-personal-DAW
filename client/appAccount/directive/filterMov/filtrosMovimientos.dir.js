var filtroMov = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/filterMov/filtrosMovimientos.html',
		controller: function (){

		},
		controllerAs: 'filtroMovCtr'
	};
};

appDirectives.directive('filtrosMovimientos', filtroMov);