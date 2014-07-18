(function(w, ng, angApp){
	var registerCtrl = function($rootScope, $location, $http, $cookieStore){
		var	urlBase = "http://localhost:3000/api/",
				scope = this;

		//las propiedades del usuario se inicializan a traves del doble binding del model-view
		this.usuario = {email: null, password: null};

		// $rootScope permite usar las propieades fijadas a el en cualquier lugar de la aplicacion
		this.login = function(){
			var urlLogin = urlBase+"sesiones/";
			$http.post(urlLogin, this.usuario)
					.success(function(data){
						$rootScope.nombre = scope.usuario.email; 
						$rootScope.mensaje = 'Acceso Correcto, sesion actualizada';
						$cookieStore.put('sessionId', data);
						$location.path("/"):
					});
		};
		this.registro = function(){
			var urlLogin = urlBase+"usuarios/";
			$http.post(urlLogin, this.usuario)
					.success(function(data){
						$rootScope.nombre = scope.usuario.email; 
						$rootScope.mensaje = 'Es tu primera conexion al Servidor';
						$cookieStore.put('sessionId', data);
						$location.path("/"):
					});
		};
	};
	angApp.controller("loginRegisterController",
							['$rootScope', '$location', '$http', '$cookieStore', registerCtrl]);
}(window, window.angular, app));