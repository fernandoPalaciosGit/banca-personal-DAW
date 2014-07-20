(function(w, ng, angApp){
	var registerCtrl = function($rootScope, $location, $http, $cookieStore){
		var	urlBase = "http://localhost:3000/api/",
				scope = this;

		//las propiedades del usuario se inicializan a traves del doble binding del model-view
		// this.usuario = {email: null, password: null};
		this.usuario = {};

		// $rootScope permite usar las propieades fijadas a el en cualquier lugar de la aplicacion
		this.login = function(){
			var urlLogin = urlBase+"sesiones/";
			$http.post(urlLogin, this.usuario)
					.success(function(data){
						console.info('Acceso Correcto, sesion actualizada');
						$rootScope.nombre = scope.usuario.email;
						$cookieStore.put('sessionId', data);
						$cookieStore.put('sessionName', scope.usuario.email.split('@')[0] );
						$location.path('/');
					});
		};
		this.registro = function(){
			var urlLogin = urlBase+"usuarios/";
			$http.post(urlLogin, this.usuario)
					.success(function(data){
						console.info('Es tu primera conexion al Servidor');
						$rootScope.nombre = scope.usuario.email; 
						$cookieStore.put('sessionId', data);
						$cookieStore.put('sessionName', scope.usuario.email.split('@')[0] );
						$location.path("/");
					});
		};
	};
	angApp.controller("loginRegisterController",
							['$rootScope', '$location', '$http', '$cookieStore', registerCtrl]);
}(window, window.angular, app));