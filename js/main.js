//asignamos un nimbre a nuestro modelo para crear controladores de aplicacion
(function(w, ng){
	var app = ng.module('accountsApp', []);

	app.controller('paramAccounts', function($scope, $filter){
		//NOTA: utilizando $scope, NO se le puede dar alias al controlador en la vista; se llaman directamente a las propiedades por su nombre
		
		this.today = new Date().toJSON().split('T')[0];
		//$scope.today = $filter("date")(Date.now(), 'yyyy-MM-dd');
	});

})(window, window.angular);