var httpRoutes = function($routeProvider){
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
		});
};

var httpStatusControl = function($q, $location, $cookieStore, $rootScope){
	return {
		//CADA VEZ QUE HAY UNA PETICION DEL CLIENTE (get || put)
		request: function (request) {
			console.info('request:' + request.url);
			$rootScope.mensaje = "";
			//almacenamos la ultima pagina de acceso, por si ha caducado la pagina y hay que redireccionar
			$rootScope.lastPage = request.url;
			request.headers["sessionId"] = $cookieStore.get("sessionId");
			return request || $q.when(request); //encabezado que devolvra el cliente al servidor
		},
		//CADA VEZ QUE HAY UNA RESPUESTA DEL SERVIDOR
		response: function(response){
			console.log(response.status);
			/**si la respuesta es que se ha desconectado, eliminar la cookie de sesion**/
			return response;
		},
		//CADA VEZ QUE EL SERVIDOR RESPONDE CON UN ERROR
		responseError: function (response) {
			console.error("excepción: " + response.status + " de :" + response.config.url);
			switch(response.status){
				case 0:
					console.info('servidor desconectado');
				case 500:
					$rootScope.mensaje = "El servidor ha fallado :-)";
				case 419:
					$rootScope.mensaje = "La Sesion Caducada @ 20 minutos";
					$cookieStore.remove('sessionId');
					$cookieStore.remove('sessionName');
					$location.path('registro');
					break;
				case 400:
					$rootScope.mensaje = "Culpa mía :-(";
					break;
				case 401:
					$rootScope.mensaje = "Credencial Invalida";
					$rootScope.mensaje += ( !$cookieStore.get('sessionId') ) ?
						', Registrate!!!' : ', login incorrecto';
					$location.path('registro');
					break;
				case 409:
					$rootScope.mensaje = "Usuario Ya registrado en el sistema, logueate!!!";
					break;
				case 404:
					$rootScope.mensaje = "Pagina no encontrada!!!";
					break;
			}
			/*antes de que el cliente ejecute las promises de get(), post() y recibir el error de respuesta del servidor,
			se anulara la respuesta*/
			return $q.reject(response);
		}
	};
};

//'ngRoute': proporciona la dependencia $routeProvider
var app = angular.module( 'accountsApp', ['ngRoute', 'ngCookies'] );

//DEPENDENCIAS DE APLICACION
//$routeProvider: enrutador de vistas, mapeamos la vista con siu enrutador
app.config( ['$routeProvider', httpRoutes] );

//INTERCEPTORES DE PETICIONES HTTP
app.config( ['$httpProvider', function($httpProvider){
	$httpProvider.interceptors.push( ['$q', '$location', '$cookieStore', '$rootScope', httpStatusControl] );
}]);