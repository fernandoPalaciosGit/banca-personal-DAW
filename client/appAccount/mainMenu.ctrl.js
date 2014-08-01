(function(w, ng, plugin){
	/*	CONTROLADOR navigationMenuController, navegacion a traves del menu principal*/
	var MainMenuCtr = function($location, $cookieStore){
		this.isActive = function(hash){
			//hash de url proprocionado por la  dependencia $location
			return hash === $location.path();
		};
		this.checkIsLogin = function (){
			return	!plugin.isEmpty($cookieStore.get('sessionId')) ||
						!plugin.isEmpty($cookieStore.get('sessionName'));
		};
	};

	app.controller( 'navigationMenuController', ['$location', '$cookieStore', MainMenuCtr] );

	//unlogin the user
	app.directive('unLogin', ['$location', function (){
		return {
			restrict: 'A',
			priority: 1,
			link: function (scope, elm, attr){
				elm.bind('click', function (event){
					// si la sesion esta abierta, cerrarla y redireccionar hacia '#/acceso'
					if( !plugin.isEmpty(plugin.getCookie('sessionId')) ){
						document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
						document.cookie = "sessionName=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
						document.location.hash = "#/registro";
					}
				});
			}
		};
	}]);

})(window, window.angular, plugin);