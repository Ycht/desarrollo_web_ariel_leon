# Tarea 4 - Desarrollo Web

## Descripción

Esta tarea es la continuación del proyecto, ahora partiendo con **Spring Boot**.

## Ejecución

Clonar el repositorio con:

```bash
git clone https://github.com/Ycht/desarrollo_web_ariel_leon/tree/Tarea-4
```

O descargarlo como .zip

Crear la base de datos con la configuración encontrada en la carpeta `database/` en el archivo `tarea2.sql` que contiene las tablas necesarias y un usuario con sus credenciales. Luego ejecutar el archivo `tabla-nota.sql` para la tabla de notas y `region-comuna.sql` que puebla las tablas region y comuna, además de ``tabla-comentario.sql`` que crea la tabla para los comentarios (opcional en este caso).

Finalmente lanzar la aplicación ejecutando el archivo ``T4Application.java``

Donde la página se puede apreciar en localhost:8080

## Decisiones tomadas

- Se cuenta con una barra de navegación en el archivo `base.html` para mejor navegación junto con los botones requeridos en las plantillas necesarias (en este caso solo se tiene el botón de inicio en Spring Boot).
- Se uso la misma dispocisión de estructura mostrada en los auxilares.
- Se crea el usuario y credenciales indicados en el enunciado al final del archivo `tarea2.sql` los cuales son usados luego en ``aplication.properties`` para conectarse a la base de datos.
- La columna de fecha se dejó con la hora para que sea más simple de distinguir si más de aviso se publicó en el mismo día.
- Se usa el mismo archivo ``style.css`` de las tareas anteriores.

## Lo que no se terminó

* La columna de comuna no muestra nada, ya que en la base de datos se guarda con el código y no cuento con el tiempo para transformalo. Las posibles soluciones que se ocurrieron para esto fue crear un diccionario para hacer la conversión o directamente crear otra tabla que guarde los nombres y tomarlo desde allí.
