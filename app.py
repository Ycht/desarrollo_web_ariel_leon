from flask import Flask, request, render_template, redirect, url_for, session, flash, jsonify
from datetime import datetime
from database.db import SessionLocal, init_db, Region, Comuna, AvisoAdopcion, Foto, ContactarPor, get_regiones, get_comunas_por_region
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
    if request.method == "POST":
        db = SessionLocal()  # para guardar los datos
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

            # Crear aviso de adopción
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

            # Procesar fotos
            fotos = request.files.getlist("fotos")
            for foto in fotos:
                if foto.filename:
                    filename = secure_filename(foto.filename)
                    f = Foto(
                        ruta_archivo=f"uploads/{filename}",
                        nombre_archivo=filename,
                        actividad_id=aviso.id,
                    )
                    db.add(f)
                    foto.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            db.commit()
            return redirect(url_for("listado_adopciones"))

        except Exception as e:
            db.rollback()
            return f"Error al guardar: {e}"

        finally:
            db.close()

    # Si es GET → mostrar formulario con regiones
    regiones = get_regiones()  # carga solo regiones
    return render_template("agregar-adopcion.html", regiones=regiones)

@app.route("/get_comunas/<int:region_id>")
def get_comunas(region_id):
    comunas = get_comunas_por_region(region_id)
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in comunas])

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


# ---- MAIN ----

if __name__ == "__main__":
    app.run(debug=True)