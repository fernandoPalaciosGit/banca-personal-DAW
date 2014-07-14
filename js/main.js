(function(w, ng){

	//CONTROLADORES DE APLICACION
	var app = ng.module('accountsApp', []);
	app.controller('bankAccountsController', accountsCtrl);

	// INJECCION DE DEPENDECCIAS: $location: informacion sobre la ruta
	app.controller('navigationMenuController', ['$location', menuCtrl]);

})(window, window.angular);