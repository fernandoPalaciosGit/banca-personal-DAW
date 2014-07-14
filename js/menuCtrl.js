/*	CONTROLADOR navigationMenuController, navegacion a traves del menu principal*/
var menuCtrl = function($location){
	this.isActive = function(hash){
		//hash de url proprocionado por la  dependencia $location
		return hash === $location.path();
	};
};