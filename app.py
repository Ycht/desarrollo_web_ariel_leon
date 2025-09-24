from flask import Flask, request, render_template, redirect, url_for, session, flash
from datetime import datetime
from database.db import SessionLocal, init_db, Region, Comuna, AvisoAdopcion, Foto, ContactarPor
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)

app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Inicializar DB (crea tablas si no existen)
init_db()

# ---- Routes ----

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/listado-adopciones")
def listado_adopciones():
    db = SessionLocal()
    adopciones = db.query(AvisoAdopcion).all()
    db.close()
    return render_template("listado-adopciones.html", adopciones=adopciones)

@app.route("/agregar-adopcion", methods=["GET", "POST"])
def agregar_adopcion():
    db = SessionLocal()

    if request.method == "POST":
        try:
            comuna_id = request.form.get("comuna")
            sector = request.form.get("sector") or None
            nombre = request.form.get("nombre")
            email = request.form.get("email")
            celular = request.form.get("celular") or None
            tipo = request.form.get("tipo")
            cantidad = int(request.form.get("cantidad"))
            edad = int(request.form.get("edad"))
            unidad_medida = request.form.get("unidad_medida")
            fecha_entrega = datetime.fromisoformat(request.form.get("fecha_entrega"))
            descripcion = request.form.get("descripcion") or None

            aviso = AvisoAdopcion(
                fecha_ingreso=datetime.now(),
                comuna_id=comuna_id,
                sector=sector,
                nombre=nombre,
                email=email,
                celular=celular,
                tipo=tipo,
                cantidad=cantidad,
                edad=edad,
                unidad_medida=unidad_medida,
                fecha_entrega=fecha_entrega,
                descripcion=descripcion,
            )
            db.add(aviso)
            db.commit()
            db.refresh(aviso)

            # Procesar contactos opcionales
            contactos = request.form.getlist("contactos[]")
            ids = request.form.getlist("contactos_id[]")
            for nombre_contacto, identificador in zip(contactos, ids):
                if nombre_contacto and identificador:
                    c = ContactarPor(
                        nombre=nombre_contacto,
                        identificador=identificador,
                        actividad_id=aviso.id,
                    )
                    db.add(c)

            # Procesar fotos (ejemplo: solo guardamos nombres de archivo)
            fotos = request.files.getlist("fotos")
            for foto in fotos:
                if foto.filename:
                    f = Foto(
                        ruta_archivo=f"uploads/{foto.filename}",
                        nombre_archivo=foto.filename,
                        actividad_id=aviso.id,
                    )
                    db.add(f)
                    # Guardar archivo en /static/uploads
                    foto.save(f"static/uploads/{foto.filename}")

            db.commit()
            return redirect(url_for("listado_adopciones"))

        except Exception as e:
            db.rollback()
            return f"Error al guardar: {e}"

        finally:
            db.close()

    # Si es GET → mostrar formulario con regiones y comunas
    regiones = db.query(Region).all()
    comunas = db.query(Comuna).all()
    db.close()
    return render_template("agregar-adopcion.html", regiones=regiones, comunas=comunas)

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


# ---- MAIN ----

if __name__ == "__main__":
    app.run(debug=True)