var express = require('express');//MVC
var bodyParser = require('body-parser');

//aplicacion MVC basada en express
var app = express();
app.use( bodyParser() );

//persistencia (la necesitabamos en la factoria)
var	movimientos = [],
	total = { ingresos: 0, gastos: 0 },
	maestros = {
		categoriasIngresos	: ['Nomina', 'Ventas', 'Intereses depositos'],
		categoriasGastos	: ['Hipoteca', 'Compras', 'Impuestos']
	};

//middleware, acceso a recursos estaticos desde este servidor
app.use( express.static('../client') );

/***********ruta de prueba************/
app.get("/test", function(req, res, next){
	res.send("<h1>Flujo de Cajas</h1><p>NodeJs y Expres funcionan!!!</p>");
});

/***********API REST para la aplicacion de angular************/
app.get("/api/pub/maestros", function(req, res, next){
	res.json(maestros);
});

app.route('/api/priv/movimientos')
	.get(function (req, res, next) {
        res.json(movimientos);
    })
	.post(function (req, res, next) {
        
        var reqBody = req.body;
        var movimiento = {
            esIngreso: reqBody.esIngreso,
            esGasto: reqBody.esGasto,
            importe: reqBody.importe,
            fecha: reqBody.fecha,
            tipo: reqBody.tipo,
            categoria: reqBody.categoria
        };

        ( !movimiento.esIngreso )   ? total.gastos += movimiento.importe
                                    : total.ingresos += movimiento.importe;
        movimientos.push(movimiento);

        res.status(200);
    });

app.get('/api/priv/total', function (req, res, next) {
    res.json(total);
});

//puerto de escucha del servidor (localhost)
app.listen(3000);