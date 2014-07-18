(function(w, ng, angApp){
	var registerCtrl = function($rootScope, $location, $http, $cookieStore){
		var	urlBase = "http://localhost:3000/api/",
				usuario = {};

		// $rootScope permite usar las propieades fijadas a el en cualquier lugar de la aplicacion
		this.login = function(){
			var urlLogin = urlBase+"sesiones/";
			$http.post(urlLogin, usuario)
					.success(function(data){
						$rootScope.nombre = this.usuario.email; 
						$rootScope.mensaje = 'Acceso Correcto, sesion actualizada';
						$cookieStore.put('sessionId', data);
						$location.path("/"):
					});
		};
		this.registro = function(){
			var urlLogin = urlBase+"usuarios/";
			$http.post(urlLogin, usuario)
					.success(function(data){
						$rootScope.nombre = this.usuario.email; 
						$rootScope.mensaje = 'Es tu primera conexion al Servidor';
						$cookieStore.put('sessionId', data);
						$location.path("/"):
					});
		};
	};
	angApp.controller("loginRegisterController",
							['$rootScope', '$location', '$http', '$cookieStore', registerCtrl]);
}(window, window.angular, app));