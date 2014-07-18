//APLICACION
//'ngRoute': proporciona la dependencia $routeProvider
var app = angular.module('accountsApp', ['ngRoute']);

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
		.when('/registro', {
			controller: 'loginRegisterController',
			controllerAs: 'loginRegisterCtrl',
			templateUrl: 'view/registro.html'
		})
		.otherwise({
			redirectTo: '/'
		})
}]);