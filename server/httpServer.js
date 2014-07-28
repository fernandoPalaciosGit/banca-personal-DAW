var express = require('express'),         //MVC
    bodyParser = require('body-parser'),  //recuperar datos de formulario por POST
    http = require('http'),               //controlar eventos de express
    ErrApp = {
        e401: 'Credencial Invalida: ',
        e409: 'Usuario con email ya registrado: ',
        e419: 'Sesion caducada @ 20 min: '
    };

var app = express(),            //aplicacion MVC basada en express
    port = process.env.PORT || 3000, //puerto de escucha de Node
    server = app.listen(port);  //puerto de escucha del servidor (localhost)

    //PERSISTENCIA DE MOVIMIENTOS
var maxId = 0,
    movimientos = [],
    total = { ingresos: 0, gastos: 0 },
    maestros = {
        categoriasIngresos  :
            ['otros ingresos', 'alquiler inmueble', 'nómina', 'propiedades', 'servicios profesoinales'],
        categoriasGastos    :
            ['gastos personales', 'gastos profesionales', 'seguros', 'impuestos', 'educación', 'colegio profesional', 'alquiler', 'luz', 'agua', 'telefono', 'compras']
    },
    //AUTENTICACION
    usuarios = [],
    sesiones = [];

var newSession = function ( newEmailUser ){
    //dar de alta con el token de sesion a traves del email
    var newSessionId = (Math.random()*88888) + 11111,
        resetTimeStamp = new Date();
    
    sesiones.push({
        email: newEmailUser,
        sessionId: newSessionId,
        timeStamp: resetTimeStamp
    });
    return newSessionId;
};

var shutDown = function (){
    console.log("el servidor se ha desconectado");

    server.close(function(){
        process.exit();
    });

    //a los 5 segundos forzaremos el apagado
    setTimeout(function(){
        process.exit();
    }, 1000*5);
};

//MIDDLEWARE: parsear encabezados http y parametros de peticion GET
app.use( bodyParser() );

//MIDDLEWARE, acceso a recursos estaticos desde este servidor
app.use( express.static('../client') );

//MIDDLEWARE, validacion de sesiones: cualquier ruta de consulta REST, que comienze por /api/priv
app.use( '/api/priv/', function (req, res, next){

    var sessionId = req.get('sessionId');
    var sesionEncontrada = sesiones.filter(function (sesion){
            return sesion.sessionId == sessionId;
        })[0];

    //ACTUALIZAR LA SESION si no han pasado 20 minutos o CADUCARLA
    if(sesionEncontrada){
        if( (new Date() - sesionEncontrada.timeStamp) > (1000*20*60) ){
            console.log(ErrApp.e419 + JSON.stringify(sesionEncontrada));
            res.send(419, ErrApp.e419);
        }else{
            console.log('TimeStamp sesion actualizada de :'+sesionEncontrada.email);
            sesionEncontrada.timeStamp = new Date();
        }
    }else{
        console.log(ErrApp.e401+' Sesion NO encontrada o caducada');
        res.send(401, ErrApp.e401);
    }

    /*NODE: si hemos llegado aqui, continuar la ejecucion,
    El middelware debe permitir acceder a la ruta con la extension api/priv/... */
    next();
});

//API REST: recuperar totales
app.get('/api/priv/total', function (req, res, next) {
    res.json(total);
});

//API REST: recuperar movimientos por parametros
app.get("/api/priv/filter_movimiento", function (req, res, next){
    //recuperamos los prametros de peticion, NO los del encabezado
    var movId = req.query.id;
    var matchMov = movimientos.filter(function (movimiento){
        return movimiento.id == movId;
    })[0];
    res.json(matchMov);
});

//API REST: recuperar y configurar movimientos
app.route('/api/priv/movimientos')
	.get(function (req, res, next) {
        res.json(movimientos);
    })
	.post(function (req, res, next) {
        
        var reqBody = req.body, //header HTTP: metadatos nuevoMovimiento
            movimiento = {
                id: maxId++,
                esIngreso: reqBody.esIngreso,
                esGasto: reqBody.esGasto,
                importe: reqBody.importe,
                fecha: reqBody.fecha,
                tipo: reqBody.tipo,
                categoria: reqBody.categoria,
                concepto: reqBody.concepto
            };

        ( !movimiento.esIngreso )   ? total.gastos   += movimiento.importe
                                    : total.ingresos += movimiento.importe;
        movimientos.push(movimiento);

        res.status(200);
        res.json(movimiento);   //callback promises cliente
    });

//API REST: recuperar maestros
app.get("/api/pub/maestros", function(req, res, next){
    res.json(maestros);
});

//API REST: gestion de Usuarios: lista y redistros
app.route('/api/usuarios/')
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
        if (!usuarios.some(function (usuario) {
            return usuario.email == checkUsuario.email;
        })) {
            //si no esta registrado, crear token de sesion y devolverlo al cliente
            usuarios.push(checkUsuario);
            console.log('Nuevo usuario sesion creada en '+checkUsuario.email);
            var sessionID = newSession(checkUsuario.email);
            res.json(sessionID);
        } else {
            console.log(ErrApp.e409+checkUsuario.email);
            res.send(409, ErrApp.e409);
        }
    });

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
        
        var usuarioValidado = usuarios.filter(function (usuario) {
            return  usuario.email == checkUsuario.email &&
                    usuario.password == checkUsuario.password;
        })[0];

        //confirmar usuario o negar conexion
        if (usuarioValidado) {
            console.log('Id sesion actualizada de '+checkUsuario.email);
            var sessionID = newSession(checkUsuario.email);
            res.json(sessionID);
        } else {
            console.log(ErrApp.e401+checkUsuario.email);
            res.send(401, ErrApp.e401);
        }
    });

//API REST: prueba de servidor
app.get("/test", function(req, res, next){
    res.send("<h1>Flujo de Cajas</h1><p>NodeJs y Expres funcionan!!!</p>");
});
console.log('Servidor NodeJS corriendo en http://localhost:'+port);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);