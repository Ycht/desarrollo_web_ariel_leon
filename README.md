# Tarea 3 - Desarrollo Web

## Descripción

Esta tarea es la continuación del proyecto básico de la rama Tarea-1 que se comenzó desarrollando con **HTML**, **CSS** y **Javascript**, sumando ahora el uso de **Flask**.

## Ejecución

Clonar el repositorio con:

```bash
git clone https://github.com/Ycht/desarrollo_web_ariel_leon/tree/Tarea-2
```

O descargarlo como .zip

En el directorio del proyecto crear un ambiente virtual de cualquier forma deseada, activarlo e instalar las dependencias con:

```bash
pip install -r requirements.txt
```

Crear la base de datos con la configuración encontrada en la carpeta `database/` en el archivo `tarea2.sql` que contiene las tablas necesarias y un usuario. Luego ejecutar el archivo `region-comuna.sql` que puebla las tablas region y comuna, además de ``tabla-comentario.sql`` que crea la tabla para los comentarios.

Finalmente lanzar la aplicación con:

```bash
flask run
```

Donde se puede apreciar en localhost.

## Decisiones tomadas

- Se cuenta con una barra de navegación en el archivo `base.html` para mejor navegación junto con los botones requeridos en las plantillas necesarias.
- Se uso la misma dispocisión de estructura mostrada en los auxilares.
- Se crea el usuario y credenciales indicados en el enunciado al final del archivo `tarea2.sql` los cuales son usando luego en `db.py` para conectarse a la base de datos.

## Cambios desde la Tarea 2

* Se corrigió la tabla ``contactar_por`` y ``foto`` para que usen correctamente ``aviso_id``, junto con los modelos correspondientes en ``db.py``.
* Se actualizó la parte de fotos del formulario para agregar un aviso de adopción para que funcione similar al de contactos.
