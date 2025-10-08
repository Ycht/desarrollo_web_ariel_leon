from flask import Flask, request, render_template, redirect, url_for, jsonify
from datetime import datetime
from database.db import SessionLocal, init_db, Region, Comuna, get_comunas_por_region, create_aviso_adopcion, get_avisos
from werkzeug.utils import secure_filename
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
    ultimos_avisos = get_avisos(limit=5)
    return render_template("index.html", ultimos_avisos=ultimos_avisos)

@app.route("/listado-adopciones")
def listado_adopciones():
    # Obtener el número de página
    page = request.args.get("page", default=1, type=int)
    avisos, total_pages = get_avisos(page=page, page_size=5)

    return render_template(
        "listado-adopciones.html",
        avisos=avisos,
        page=page,
        total_pages=total_pages
    )

@app.route("/agregar-adopcion", methods=["GET", "POST"])
def agregar_adopcion():
    if request.method == "POST":
        try:
            comuna_id = request.form.get("comuna_id", type=int)
            sector = request.form.get("sector") or None
            nombre = request.form.get("nombre")
            email = request.form.get("email")
            celular = request.form.get("celular") or None
            tipo = request.form.get("tipo-mascota")
            cantidad = int(request.form.get("cantidad-mascota"))
            edad = int(request.form.get("edad-mascota"))
            unidad_medida = request.form.get("medida-edad")
            fecha_entrega = datetime.fromisoformat(request.form.get("fecha-entrega"))
            descripcion = request.form.get("descripcion-mascota") or None

            # Fotos
            fotos = []
            for f in request.files.getlist("foto-mascota"):
                if f.filename:
                    filename = secure_filename(f.filename)
                    path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                    f.save(path)
                    fotos.append({"ruta_archivo": path, "nombre_archivo": filename})

            # Contactos
            contactos = []
            container_prefix = "contacto-select-"
            for i in range(1,6):
                tipo_contacto = request.form.get(f"{container_prefix}{i}")
                ident = request.form.get(f"contacto-input-{i}")
                if tipo_contacto and ident:
                    contactos.append({"nombre": tipo_contacto, "identificador": ident})

            create_aviso_adopcion(comuna_id, sector, nombre, email, celular, tipo, cantidad,
                              edad, unidad_medida, fecha_entrega, descripcion, fotos, contactos)
            
            return redirect(url_for("index"))

        except Exception as e:
            return f"Error al guardar aviso de adopción: {e}"

    # GET: Mostrar formulario
    try:
        db = SessionLocal()
        regiones = db.query(Region).order_by(Region.nombre).all()

        comunas_por_region = {}
        for region in regiones:
            comunas = db.query(Comuna).filter(Comuna.region_id == region.id).order_by(Comuna.nombre).all()
            comunas_por_region[region.id] = [{"id": c.id, "nombre": c.nombre} for c in comunas]
    finally:
        db.close()

    return render_template(
        "agregar-adopcion.html",
        regiones=regiones,
        comunas_por_region=comunas_por_region
    )

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