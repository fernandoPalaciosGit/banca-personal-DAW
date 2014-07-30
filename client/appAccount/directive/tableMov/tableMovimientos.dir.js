var tablaMovController = function (){
	this.filteredMov = [];
	this.sentido = true;
	this.campo = 'id';
	
	this.checkCampoSentido = function (isCampo){
			this.sentido = (this.campo === isCampo) ? !this.sentido : this.sentido;
			this.campo = isCampo;
	};

	this.getTotal = function(){
		if( !!this.filteredMov ){
			var total = 0, product, importe;
			for(var i = 0, len = this.filteredMov.length; i < len; i++){
				product = this.filteredMov[i];
				importe = product.importe;
				importe = (!product.esGasto) ? importe : importe*=-1 ;
				total += importe;
			}
			return total;
		}
	};
};

var tablaMov = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/tableMov/tableMovimientos.html',
		controller: tablaMovController,
		controllerAs: 'tablaMovCtr'
	};
};

appDirectives.directive('tablaMovimientos', tablaMov);

appDirectives.directive('redirectSelectMov', function () {
    return {
        restrict: 'A',
        priority: 1,
        link: function($scope, elm, attr) {
        	elm.bind('click', function(){
        		// calling the $location.path outside of the angularjs digest.
        		var hrefMovRedirect = 'http://localhost:3000/appAccount/#/movimiento/'+$scope.movimiento.id;
        		$scope.$apply(function() {
        			window.location.href = hrefMovRedirect; 
        		});
        	});
        }
    };
});

// FIJAR BOTTOM FOOTER
appDirectives.directive('footerFixed', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

        		//fixTableSticky: si el borde inferior de la la tabla se encuentra posicionado por debajo de la altura maxima de la ventana
        		
			     		/* 1- METODO DE PLUGIN
			        		var tableFixedProp = {
					        			altClass: 'odd',
										footer: true,
										fixedColumns: 1
					        		};
			        		$(table).fixedHeaderTable(tableFixedProp);
			     		*/
			     	
	        			/* 2- METODO PROPIO
     				var table = element[0].offsetParent;
     				var tableOffsetDocument = element[0].getBoundingClientRect();
	        		window.addEventListener('scroll', function (evScroll){
	        			var	eTop = tableOffsetDocument.top || $(table).offset().top,
	        					elBottom = (eTop + $(table).outerHeight()) - ($(window).scrollTop() + $(table).outerHeight()),
	        					elTop = (eTop - $(window).scrollTop()) - $('.navbar.navbar-fixed-top').outerHeight();
	        			
	        			if( elBottom >= 0 || elTop < 0 ){
	        				$(element).addClass('fixTableSticky');
	        			}else{
	        				$(element).removeClass('fixTableSticky');
	        			}
						*/

	        			/*
		        		if( Math.abs(elRelWindow.top - jQuery(window).height()) < elRelWindow.height ){
								$(element).toggleClass('fixTableSticky');
		        		}
	        		} , false);
		        		*/

		      		// invoke thfloat() twice; once for "head" and once for "foot"; both attach to window
		      		window.setTimeout(function(){

		      			window.scrollTo(0,3);
							$('#'+attrs.tableFixed)
								.thfloat('init')
								.thfloat('init', {
									side : "foot"
								});
		      		}, 100);

        }
    };
}); 