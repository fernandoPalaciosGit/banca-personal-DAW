(function(w, ng){
	/*	CONTROLADOR navigationMenuController, navegacion a traves del menu principal*/
	var MainMenuCtr = function($location){
		this.isActive = function(hash){
			//hash de url proprocionado por la  dependencia $location
			return hash === $location.path();
		};
	};

	app.controller( 'navigationMenuController', ['$location', MainMenuCtr] );

})(window, window.angular);