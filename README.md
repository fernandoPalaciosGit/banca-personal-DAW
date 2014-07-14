# BancaEscuelaIT

*   proyecto basado en angularJS, gestion bancaria de ingresos y gastos
*   proyecto base de las practicas en [curso online de Angular JS EscuelaIT](http://escuela.it/cursos/taller-angularjs/)

1.  **VERSION 0.1.0**

    *   _Aplicacion_

        *   calcular ingresos y gastos por tipo, cnatidad y fecha.
    *   _Implementacion_

        *   Aplicacion sin Javascript.
        *   Mantener la pila de contabilidad en cache del navegador.
        *   La persistencia de datos y la logica de negocio se encuentran embebidas en codigo html de la vista.
2.  **VERSION 0.2.0**

    *   _Aplicacion_

        *   Misma aplicacion: Calcular ingresos y gastos por tipo, cnatidad y fecha.
    *   _Implementacion_

        *   Separar la vista del modelo de negocio en archivos diferentes y con una estructura en modulos adecuada para controladores de AngularJS.
        *   Mantener la persistencia de datos en local.
3.  **VERSION 0.3.0**

    *   _Aplicacion_

        *   Misma aplicacion: Calcular ingresos y gastos por tipo, cnatidad y fecha.
    *   _Implementacion_

        *   Maquetar una _Single page Apliction_ con 3 vistas

            *TOTALES: mostrar los totales de ingresos, gastos y balnce.
            *NUEVO: realizar una nueva operacion de contabilidad.
            *LISTA: listar en una tabla todos nuestros movimientos contables.
4.  **VERSION 0.3.1**

    *   _Implementacion_

        *   _factoria de movimientos_

            *la dependencia de aplicacion _$factory_ nos ofrece una API de propiedades de controlador (utiliza el patron de diseño de software de Modulo Revelado), a las que cualquier vista puede acceder y que mantiene la persistencia en cache a medida que nos movemos por las diferentes vistas.
            *Esto ya estaba implementado a través del controlador explicito en una sola vista, pero al asignar diferentes vistas (cada una en un fchero) a una dependencia (_$rootProvider_), quedaron incapacitadas de mantener una persistencia de datos local, ya que ahora estan separadas.