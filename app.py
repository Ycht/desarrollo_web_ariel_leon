from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import cross_origin
from datetime import datetime
from database.db import init_db, create_aviso_adopcion, get_avisos, get_aviso_por_id, get_regiones_y_comunas, get_avisos_por_dia, get_avisos_por_tipo, get_avisos_por_mes_y_tipo, get_comentarios_por_aviso, add_comentario
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
    regiones, comunas_por_region = get_regiones_y_comunas()

    return render_template(
        "agregar-adopcion.html",
        regiones=regiones,
        comunas_por_region=comunas_por_region
    )

@app.route("/aviso/<int:aviso_id>")
def detalle_aviso(aviso_id):
    """
    Muestra la información detallada de un aviso de adopción específico.
    """
    aviso = get_aviso_por_id(aviso_id)
    if not aviso:
        return render_template("404.html"), 404 # TODO

    # Formatear contactos en una lista
    contactos = [
        {"nombre": c.nombre, "identificador": c.identificador}
        for c in aviso.contactos
    ]

    # Formatear fecha
    fecha_ingreso = aviso.fecha_ingreso.strftime("%d-%m-%Y %H:%M")

    return render_template(
        "detalle_aviso.html",
        aviso=aviso,
        contactos=contactos,
        fecha_ingreso=fecha_ingreso
    )

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/api/estadisticas")
def api_estadisticas():
    fechas, cantidades = get_avisos_por_dia()
    tipos = get_avisos_por_tipo()
    meses, gatos, perros = get_avisos_por_mes_y_tipo()

    return jsonify({
        "por_dia": {"fechas": fechas, "cantidades": cantidades},
        "por_tipo": tipos,
        "por_mes_y_tipo": {"meses": meses, "gatos": gatos, "perros": perros}
    })

@app.route("/comentarios/<int:aviso_id>", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def mostrar_comentarios(aviso_id):
    """
    Devuelve los comentarios de un aviso de adopción en formato JSON.
    """
    comentarios = get_comentarios_por_aviso(aviso_id)
    comentarios_data = [
        {
            "nombre": c.nombre,
            "texto": c.texto,
            "fecha": c.fecha.strftime("%d-%m-%Y %H:%M")
        }
        for c in comentarios
    ]
    return jsonify(comentarios_data)

@app.route("/comentarios/<int:aviso_id>", methods=["POST"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def agregar_comentario(aviso_id):
    """
    Recibe un nuevo comentario mediante JSON y lo guarda en la base de datos.
    """
    data = request.get_json()
    nombre = data.get("nombre", "").strip()
    texto = data.get("texto", "").strip()

    # Validaciones
    if not (3 <= len(nombre) <= 80):
        return jsonify({"success": False, "error": "El nombre debe ser de largo mínimo 3 y máximo 80."}), 400
    if len(texto) < 5:
        return jsonify({"success": False, "error": "El comentario debe tener al menos 5 caracteres."}), 400

    ok = add_comentario(aviso_id, nombre, texto)
    if ok:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Error al guardar el comentario."}), 500

# ---- MAIN ----

if __name__ == "__main__":
    app.run(debug=True)