(function(w, ng, appAng, plugin){
	/*	CONTROLADOR bankAccountsController, inicializar propiedades del modelo de aplicacion */
	var AccountingCtrl = function($rootScope, $location, $cookieStore, maestrosFactory, movimientosFactory){
		var	scope = this, //referncia al scope del controlador, para los callback de las peticiones REST
				fechaActual = new Date().toJSON().split('T')[0];

		//encabezados de directivas <mensaje>
		this.titulo = {
			totMovTpl: 'Controlar el Balance de tus movimientos.',
			newMovTpl: 'Introduce los datos de un nuevo movimiento.',
			listMovTpl: 'Lista de movimientos actuales.'
		};
		
		//valores por defecto del nuevo movimiento
		this.nuevoMovimiento = {
			esIngreso: 1, esGasto: 0, importe: 0,
			tipo : 'ingreso', fecha: fechaActual
		};


		this.total = { ingresos: 0, gastos: 0 };

		//comprobar si hay sesion en el cliente, reconocer al cliente	
		if( !plugin.isEmpty($cookieStore.get('sessionId')) ){
			$rootScope.nombre = $cookieStore.get('sessionName');

			//NOTA: aunque haya sesion, al llamar a los movimientos o totales, el servidor se encarga de comprobar si esta dado de alta el usuario en el sistema;
			maestrosFactory.getMaestros().success(function (data){
				scope.maestros = data;
			});

			movimientosFactory.getMovimientos().success(function (data){
				scope.movimientos = data;
			});

			movimientosFactory.getTotal().success(function (data){
				scope.total = data;
			});
		}else{
			$rootScope.mensaje = 'primero debes Acceder a sistema';
			$location.path('registro');	
		}

		this.saveMovimiento = function (){
			var auxCopyMov = ng.copy(this.nuevoMovimiento);

			if( !this.checkValidImporte() ){
				/*almacenar datos en el server y recuperar nuevos movimentos y totales*/
				movimientosFactory.setMovimientos(auxCopyMov)
										.success(function(data, status, headers, config) {
						//asegurar el update de nuevo movimiento
						if(status == 200){
							movimientosFactory.getTotal().success(function(data){
								scope.total = data;
							});
							movimientosFactory.getMovimientos().success(function(data){
								scope.movimientos = data;
							});
						}
				});
				/*actualizar vista*/
				scope.resetMovimiento();
			}else{
				w.alert('Falta la cantidad del movimiento');
			}
		};

		this.checkValidImporte = function(event){
			if(	Math.abs(this.nuevoMovimiento.importe) == 0 ||
					this.nuevoMovimiento.importe < 0 ||
					plugin.isEmpty(this.nuevoMovimiento.importe) ){

				if ( plugin.isEmpty(event) || event.type === 'blur' ) {
					this.nuevoMovimiento.importe = 0;
				} else if ( event.type === 'focus' ) {
					this.nuevoMovimiento.importe = '';
				}
				return true;
			}else return false;
		};

		this.resetMovimiento = function (){
			this.checkTipoMovimiento();
			this.nuevoMovimiento.categoria = '';
			this.nuevoMovimiento.importe = 0;
			this.nuevoMovimiento.concepto = '';
			this.nuevoMovimiento.fecha = fechaActual;
		};

		this.checkTipoMovimiento = function (){
			this.nuevoMovimiento.tipo = (!this.nuevoMovimiento.esIngreso) ? 'gasto' : 'ingreso';
		};

		this.balance = function (){
			return this.total.ingresos - this.total.gastos;
		};
	};

	//CONTROLADORES DE APLICACION y dependencia de controlador $location
	appAng.controller(	'bankAccountsController',
	['$rootScope', '$location', '$cookieStore', 'maestrosFactory', 'movimientosFactory', AccountingCtrl] );
})(window, window.angular, app, plugin);