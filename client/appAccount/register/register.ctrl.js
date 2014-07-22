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
						$rootScope.nombre = scope.usuario.email;
						$rootScope.mensaje = 'Acceso Correcto, sesion actualizada';
						console.info('Sesion actualizada, resetear el TimeStamp');
						$cookieStore.put('sessionId', data);
						$cookieStore.put('sessionName', scope.usuario.email.split('@')[0] );
						$location.path('/');
					});
		};
		this.registro = function(){
			var urlLogin = urlBase+"usuarios/";
			$http.post(urlLogin, this.usuario)
					.success(function(data){
						$rootScope.nombre = scope.usuario.email; 
						$rootScope.mensaje = 'Es tu primera conexion al Servidor';
						console.info('Nuevo usuario registrado');
						$cookieStore.put('sessionId', data);
						$cookieStore.put('sessionName', scope.usuario.email.split('@')[0] );
						$location.path("/");
					});
		};
	};
	angApp.controller("loginRegisterController",
							['$rootScope', '$location', '$http', '$cookieStore', registerCtrl]);
}(window, window.angular, app));