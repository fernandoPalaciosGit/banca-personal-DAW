var express = require('express'), //MVC
    bodyParser = require('body-parser'); //HTTP req, resp

//aplicacion MVC basada en express
var app = express();
app.use( bodyParser() );

//PERSISTENCIA DE MOVIMIENTOS
var	total = { ingresos: 0, gastos: 0 },
	maestros = {
		categoriasIngresos	: ['Nomina', 'Ventas', 'Intereses depositos'],
		categoriasGastos	: ['Hipoteca', 'Compras', 'Impuestos']
	},
    movimientos = [];

//AUTENTIFICACION
var usuarios = [],
    sesiones = [];

//MIDDLEWARE, acceso a recursos estaticos desde este servidor
app.use( express.static('../client') );

//MIDDLEWARE, validacion de sesiones
app.use( '/api/priv/', function (req, res, next){
    //APLICAMOS UNA REGLA PARA TODAS LAS URL QUE COMIENZEN POR /api/priv
    var sessionId = req.get('sessionId');
    var sesionEncontrada = sesiones.filter(function(sesion){
            return sesion.sessionID === sessionId;
        })[0];

    //ACTUALIZAR LA SESION si no han pasado 20 minutos o CADUCARLA
    if(sesionEncontrada){
        if( (new Date() - sesionEncontrada.timeStamp) > (1000*60*20) ){
            console.log('Sesion caducada: '+JSON.stringify(sesionEncontrada));
            res.send(419, 'Sesion Caducada');
        }else{
            sesionEncontrada.timeStamp = new Date();
        }
    }else{
        res.send(401, 'Credencial Invalida');
    }
    //NODE: si hemos llegado aqui, continuar la ejecucion
    next();
});

//API REST: prueba de servidor
app.get("/test", function(req, res, next){
	res.send("<h1>Flujo de Cajas</h1><p>NodeJs y Expres funcionan!!!</p>");
});

//API REST: recuperar maestros
app.get("/api/pub/maestros", function(req, res, next){
	res.json(maestros);
});

//API REST: recuperar totales
app.get('/api/priv/total', function (req, res, next) {
    res.json(total);
});

//API REST: recuperar y configurar movimientos
app.route('/api/priv/movimientos')
	.get(function (req, res, next) {
        res.json(movimientos);
    })
	.post(function (req, res, next) {
        
        var reqBody = req.body;//header HTTP: metadatos nuevoMovimiento
        var movimiento = {
            esIngreso: reqBody.esIngreso,
            esGasto: reqBody.esGasto,
            importe: reqBody.importe,
            fecha: reqBody.fecha,
            tipo: reqBody.tipo,
            categoria: reqBody.categoria
        };

        ( !movimiento.esIngreso )   ? total.gastos   += movimiento.importe
                                    : total.ingresos += movimiento.importe;
        movimientos.push(movimiento);

        res.status(200);
    });

//API REST: gestion de Usuarios: lista y redistros
app.route('/api/usuarios')
    .get(function (req, res, next){
        res.json(usuarios);
    })
    .post(function (req, res, next){
        var reqBody = req.body;//header HTTP: metadatos nuevoUsuario
        var checkUsuario = {
            email: reqBody.email,
            password: reqBody.password
        };

        //comprobar registro o dar de alta nuevo usuario
        for (var i = 0, len = usuarios.length; i < len; i++) {
            if( usuarios[i].email === checkUsuario.email){
                console.log('Usuario con email ya registrado: '+checkUsuario.email);
                res.send(409, "Email '"+checkUsuario.email+"' ya registrado");
            }
        }

        //si no esta registrado, crear token de sesion y devolverlo al cliente
        usuarios.push(checkUsuario);
        var sessionID = newSession(checkUsuario.email);
        res.json(sessionID);
    });

var newSession = function ( newEmailUser ){
    //dar de alta con el token de sesion a traves del email
    var sessionID = Math.random() * (88888) + 11111,
        timeStamp = new Date();
    
    sesiones.push({
        email: newEmailUser,
        sessionID: sessionID,
        timeStamp: timeStamp
    });
    return sessionID;
};

// API REST: gestion de sesiones
/*si el usuario esta registrado, comprobar si la sesionque envia el cliente esta dada de alta para ese cliente en el servidor (email)*/
app.route('/api/sesiones')
    .get(function (req, res, next){
        res.json(sesiones);
    })
    .post(function (req, res, next){
        var reqBody = req.body;//header HTTP: metadatos nuevoUsuario
        var checkUsuario = {
            email: reqBody.email,
            password: reqBody.password
        };
        
        //confirmar usuario o negar conexion
        for (var i = 0, len = usuarios.length; i < len; i++) {
            if( usuarios[i].email === checkUsuario.email &&
                usuarios[i].password === checkUsuario.password    ){
                var sessionID = newSession(checkUsuario.email);
                res.json(sessionID);
            }
        }

        console.log("Credencial Invalida: "+checkUsuario.email);
        res.send(401, 'Credencial Invalida');
    });

//puerto de escucha del servidor (localhost)
app.listen(3000);