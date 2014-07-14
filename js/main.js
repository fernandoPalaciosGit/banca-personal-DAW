(function(w, ng){

	//APLICACION
	//'ngRoute': proporciona la dependencia $routeProvider
	var app = ng.module('accountsApp', ['ngRoute']);
	
	//DEPENDENCIAS DE APLICACION
	//$routeProvider: enrutador de vistas, mapeamos la vista con siu enrutador
	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when('/', {
				controller: 'bankAccountsController',
				controllerAs: 'accountsCtrl', //alias utilizado en las vistas
				templateUrl: 'view/totalCuentas.tpl.html'
			})
			.when('/nuevo', {
				controller: 'bankAccountsController',
				controllerAs: 'accountsCtrl',
				templateUrl: 'view/nuevaCuenta.tpl.html'
			})
			.when('/lista', {
				controller: 'bankAccountsController',
				controllerAs: 'accountsCtrl',
				templateUrl: 'view/listaCuentas.tpl.html'
			})
			.otherwise({
				redirectTo: '/'
			})
	}]);
	
	//CONTROLADORES DE APLICACION y dependencia de controlador $location
	app.controller('bankAccountsController', accountsCtrl);
	app.controller('navigationMenuController', ['$location', menuCtrl]);

})(window, window.angular);